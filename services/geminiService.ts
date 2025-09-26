import { GoogleGenAI, Type, Chat, GenerateContentParameters } from '@google/genai';
import { SOLVER_SYSTEM_INSTRUCTION, CHAT_SYSTEM_INSTRUCTION } from '../constants';
import { SolutionResponse, SolveInput, ExampleProblem } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const solutionResponseSchema = {
    type: Type.OBJECT,
    properties: {
        status: { type: Type.STRING, enum: ['solved', 'unsolved'] },
        title: { type: Type.STRING },
        classification: { type: Type.STRING, description: "The branch of mathematics the problem belongs to (e.g., Algebra, Calculus)." },
        difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard', 'Advanced'] },
        difficultyRating: { type: Type.NUMBER, description: "A numerical rating from 1 to 10." },
        difficultyJustification: { type: Type.STRING, description: "Justification for the difficulty rating." },
        keyConcepts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of key mathematical concepts or theorems required."
        },
        reasoning: { type: Type.STRING, description: "A high-level overview of the solution approach." },
        solution: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            nullable: true
        },
        explanation: { 
            type: Type.STRING,
            nullable: true
        },
        alternativeMethods: {
            type: Type.STRING,
            nullable: true,
            description: "A brief description of an alternative solution method."
        },
        commonPitfalls: {
            type: Type.STRING,
            nullable: true,
            description: "A brief description of common mistakes."
        }
    },
    required: ['status', 'title', 'classification', 'difficulty', 'difficultyRating', 'difficultyJustification', 'keyConcepts', 'reasoning']
};

const exampleProblemsSchema = {
    type: Type.OBJECT,
    properties: {
        problems: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    problem: { type: Type.STRING }
                },
                required: ['id', 'problem']
            }
        }
    },
    required: ['problems']
};

const mathFactSchema = {
    type: Type.OBJECT,
    properties: {
        fact: {
            type: Type.STRING,
            description: "A surprising and fun math fact, explained simply."
        }
    },
    required: ['fact']
};


export async function generateInitialData(language: 'en' | 'ar'): Promise<{ examples: ExampleProblem[], fact: string }> {
    try {
        const langName = language === 'ar' ? 'Arabic' : 'English';

        const [examplesResponse, factResponse] = await Promise.all([
            ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Generate 4 diverse and simple math problems suitable for an educational app. Provide a unique id for each. Your response must be in ${langName}.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: exampleProblemsSchema,
                },
            }),
            ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Provide one surprising and fun math fact of the day. Keep it short and easy to understand. Your response must be in ${langName}.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: mathFactSchema,
                },
            })
        ]);

        const examplesParsed = JSON.parse(examplesResponse.text.trim());
        const factParsed = JSON.parse(factResponse.text.trim());

        return {
            examples: examplesParsed.problems as ExampleProblem[],
            fact: factParsed.fact as string,
        };

    } catch (error) {
        console.error("Error generating initial data:", error);
        // Return fallback data in case of an API error
        return {
            examples: [
                { id: 'fallback-1', problem: language === 'ar' ? 'حل لـ س: 3س - 7 = 5' : 'Solve for x: 3x - 7 = 5' },
                { id: 'fallback-2', problem: language === 'ar' ? 'ما هي مساحة دائرة نصف قطرها 5؟' : 'What is the area of a circle with a radius of 5?' }
            ],
            fact: language === 'ar' ? 'الصفر هو العدد الصحيح الوحيد الذي ليس موجبًا ولا سالبًا.' : 'Zero is the only integer that is neither positive nor negative.',
        };
    }
}


export async function solveProblem(problem: SolveInput, language: 'en' | 'ar'): Promise<SolutionResponse> {
    try {
        let contents: GenerateContentParameters;
        const langName = language === 'ar' ? 'Arabic' : 'English';
        const systemInstruction = `${SOLVER_SYSTEM_INSTRUCTION}\n\nYou must provide your entire response in ${langName}.`;


        if (typeof problem === 'string') {
            contents = problem;
        } else {
            const imagePart = {
                inlineData: {
                    mimeType: problem.image.mimeType,
                    data: problem.image.data,
                },
            };
            const textPart = { text: problem.prompt };
            contents = { parts: [imagePart, textPart] };
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: solutionResponseSchema,
            },
        });
        
        const text = response.text.trim();
        const parsedJson = JSON.parse(text);

        // Basic validation to ensure the parsed object matches the expected structure
        if (!parsedJson.status || !parsedJson.title || !parsedJson.classification || !parsedJson.difficulty || !parsedJson.difficultyRating || !parsedJson.difficultyJustification || !parsedJson.keyConcepts || !parsedJson.reasoning) {
            throw new Error("Invalid JSON response structure from API.");
        }

        return parsedJson as SolutionResponse;

    } catch (error) {
        console.error("Error solving problem:", error);
        throw new Error("Failed to get a valid response from the AI. Please try again.");
    }
}

export function createChatSession(language: 'en' | 'ar'): Chat {
    const langName = language === 'ar' ? 'Arabic' : 'English';
    const systemInstruction = `${CHAT_SYSTEM_INSTRUCTION}\n\nYou must provide your entire response in ${langName}.`;
    
    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return chat;
}