import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { SolveInput, SolutionResponse } from '../types';
import LinkIcon from './icons/LinkIcon';
import DownloadIcon from './icons/DownloadIcon';
import LoadingSpinner from './icons/LoadingSpinner';

declare global {
    interface Window {
        html2canvas: any;
    }
}

interface ShareMenuProps {
    problem: SolveInput | null;
    solution: SolutionResponse;
    solutionElement: HTMLElement | null;
    onClose: () => void;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ problem, solution, solutionElement, onClose }) => {
    const { t, language } = useLanguage();
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    const handleCopyLink = () => {
        if (typeof problem !== 'string') {
            alert(t('shareLinkDisabledTooltip'));
            return;
        }

        const dataToShare = {
            problem,
            solution,
            language,
        };

        try {
            const jsonString = JSON.stringify(dataToShare);
            const base64String = btoa(unescape(encodeURIComponent(jsonString)));
            const urlSafeBase64 = encodeURIComponent(base64String);
            const shareUrl = `${window.location.origin}${window.location.pathname}#data=${urlSafeBase64}`;

            navigator.clipboard.writeText(shareUrl).then(() => {
                setCopyStatus('copied');
                setTimeout(() => {
                    setCopyStatus('idle');
                    onClose();
                }, 2000);
            });
        } catch (error) {
            console.error('Failed to create share link:', error);
            alert('Could not create share link.');
        }
    };

    const handleDownloadImage = async () => {
        if (!solutionElement || !window.html2canvas) {
            alert('Could not generate image. The required library is missing.');
            return;
        }
        setIsGeneratingImage(true);
        try {
            const canvas = await window.html2canvas(solutionElement, {
                backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                scale: 2, // Higher resolution
            });
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${solution.title.replace(/ /g, '_')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error generating image:', error);
            alert('An error occurred while generating the image.');
        } finally {
            setIsGeneratingImage(false);
            onClose();
        }
    };

    const isLinkSharingDisabled = typeof problem !== 'string';

    return (
        <div className="absolute top-full mt-2 end-0 w-56 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-20" role="menu" aria-orientation="vertical" aria-labelledby="share-button">
            <div className="py-1">
                <button
                    onClick={handleCopyLink}
                    disabled={isLinkSharingDisabled}
                    title={isLinkSharingDisabled ? t('shareLinkDisabledTooltip') : t('copyLink')}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LinkIcon className="w-5 h-5 me-3" />
                    <span>{copyStatus === 'copied' ? t('linkCopied') : t('copyLink')}</span>
                </button>
                <button
                    onClick={handleDownloadImage}
                    disabled={isGeneratingImage}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                    {isGeneratingImage ? (
                        <LoadingSpinner className="w-5 h-5 me-3" />
                    ) : (
                        <DownloadIcon className="w-5 h-5 me-3" />
                    )}
                    <span>{isGeneratingImage ? t('generatingImage') : t('downloadImage')}</span>
                </button>
            </div>
        </div>
    );
};

export default ShareMenu;