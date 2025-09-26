import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatRole, AppChatSession } from '../types';
import SendIcon from './icons/SendIcon';
import LoadingSpinner from './icons/LoadingSpinner';
import { useLanguage } from '../hooks/useLanguage';
import NewChatIcon from './icons/NewChatIcon';
import LatexRenderer from './LatexRenderer';

interface ChatProps {
  chatSession: AppChatSession | null;
  isEnabled: boolean;
  onNewChat: () => void;
}

const Chat: React.FC<ChatProps> = ({ chatSession, isEnabled, onNewChat }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  // Clear chat when a new session starts
  useEffect(() => {
    if (chatSession) {
        setMessages([]);
    }
  }, [chatSession])


  const handleSend = async () => {
    if (!input.trim() || !chatSession || isStreaming) return;

    const userMessage: ChatMessage = { role: ChatRole.USER, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    try {
      const stream = await chatSession.sendMessageStream({ message: input });
      let modelResponseText = '';
      
      const modelMessage: ChatMessage = { role: ChatRole.MODEL, text: '' };
      setMessages(prev => [...prev, modelMessage]);

      for await (const chunk of stream) {
        modelResponseText += chunk.text;
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].text = modelResponseText;
            return newMessages;
        });
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = { role: ChatRole.MODEL, text: t('chatError') };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-full bg-gray-800 rounded-lg border border-gray-700 shadow-lg`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-xl font-bold text-blue-400 text-start">
          {t('tutorTitle')}
        </h2>
        <button 
          onClick={onNewChat}
          className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded-md"
          aria-label={t('newChat')}
          title={t('newChat')}
        >
          <NewChatIcon className="w-5 h-5"/>
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>{t('followUpPlaceholder')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === ChatRole.USER ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${msg.role === ChatRole.USER ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                   <LatexRenderer className="whitespace-pre-wrap text-start">{msg.text}</LatexRenderer>
                </div>
              </div>
            ))}
             {isStreaming && messages[messages.length-1]?.role === ChatRole.USER && (
               <div className="flex justify-start">
                  <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg bg-gray-700 text-gray-200">
                    <LoadingSpinner className="w-5 h-5"/>
                  </div>
                </div>
              )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className={`p-4 border-t border-gray-700 flex-shrink-0`}>
        <div className="flex items-center bg-gray-900 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t('askAQuestion')}
            className="w-full bg-transparent p-3 focus:outline-none text-gray-200 placeholder-gray-500"
            disabled={isStreaming}
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="p-3 text-blue-400 hover:text-blue-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className={`w-6 h-6 ${language === 'ar' ? 'transform -scale-x-100' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;