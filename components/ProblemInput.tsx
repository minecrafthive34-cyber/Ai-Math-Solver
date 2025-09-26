import React, { useState, useRef } from 'react';
import LoadingSpinner from './icons/LoadingSpinner';
import ClearIcon from './icons/ClearIcon';
import ImageIcon from './icons/ImageIcon';
import CloseIcon from './icons/CloseIcon';
import { useLanguage } from '../hooks/useLanguage';
import { SolveInput, ExampleProblem } from '../types';
import ExampleProblems from './ExampleProblems';
import LatexRenderer from './LatexRenderer';

interface ProblemInputProps {
  onSolve: (problem: SolveInput) => void;
  onClear: () => void;
  isLoading: boolean;
  exampleProblems: ExampleProblem[];
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};


const ProblemInput: React.FC<ProblemInputProps> = ({ onSolve, onClear, isLoading, exampleProblems }) => {
  const [problem, setProblem] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setProblem(''); // Clear text problem when image is selected
    }
  };
  
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  const handleClear = () => {
    setProblem('');
    handleRemoveImage();
    onClear();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (imageFile) {
        const base64Data = await fileToBase64(imageFile);
        onSolve({
            image: { mimeType: imageFile.type, data: base64Data },
            prompt: 'Solve the math problem in this image.'
        });
    } else if (problem.trim()) {
      onSolve(problem);
    }
  };

  const handleSelectExample = (selectedProblem: string) => {
    if (isLoading) return;
    setProblem(selectedProblem);
    onSolve(selectedProblem);
  };

  const isSubmitDisabled = isLoading || (!problem.trim() && !imageFile);
  const areExamplesDisabled = isLoading || !!imageFile;

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">{t('enterProblem')}</h2>
      <form onSubmit={handleSubmit}>
        {imagePreview ? (
            <div className="relative mb-4 group">
                <img src={imagePreview} alt="Problem preview" className="rounded-md max-h-48 w-auto mx-auto"/>
                <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 end-2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={t('removeImage')}
                    >
                    <CloseIcon className="w-5 h-5" />
                </button>
                <p className="text-center text-sm text-gray-400 mt-2">{t('imageSelected')}</p>
            </div>
        ) : (
             <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder={t('placeholder')}
                className="w-full h-40 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 resize-none text-gray-200 placeholder-gray-500"
                disabled={isLoading || !!imageFile}
            />
        )}
        
        {problem && !imagePreview && (
            <div className="mt-4 p-3 bg-gray-900 border border-gray-600 rounded-md">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">{t('livePreview')}</h4>
                <div className="min-h-[40px] text-gray-200 text-start">
                    <LatexRenderer>{problem}</LatexRenderer>
                </div>
            </div>
        )}

        {!imagePreview && <ExampleProblems problems={exampleProblems} onSelectProblem={handleSelectExample} isDisabled={areExamplesDisabled} />}
       
        <div className="flex items-center my-4">
            <span className="flex-grow border-t border-gray-700"></span>
            <span className="px-2 text-gray-500 text-sm">{t('or')}</span>
            <span className="flex-grow border-t border-gray-700"></span>
        </div>

        <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            id="image-upload"
        />
        <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-gray-700 text-gray-200 font-bold py-3 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-200"
        >
            <ImageIcon className="w-5 h-5 me-2" />
            {t('uploadImage')}
        </button>


        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading && isSubmitDisabled}
              className="w-full flex items-center justify-center bg-gray-600 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-200"
            >
              <ClearIcon className="w-5 h-5 me-2" />
              {t('clear')}
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-500 disabled:cursor-not-allowed transition duration-200"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="w-5 h-5 me-2" />
                  {t('solving')}
                </>
              ) : (
                t('solve')
              )}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ProblemInput;