import React, { useLayoutEffect, useRef } from 'react';

declare global {
  interface Window {
    katex: any;
    renderMathInElement: (element: HTMLElement, options?: any) => void;
  }
}

interface LatexRendererProps {
  children: string;
  className?: string;
}

const LatexRenderer: React.FC<LatexRendererProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    // Check if KaTeX and its auto-render extension are loaded.
    if (window.renderMathInElement && window.katex) {
      element.textContent = children;
      try {
        window.renderMathInElement(element, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          // Do not throw an error on invalid LaTeX, just render it as text.
          throwOnError: false,
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        // If rendering fails, ensure the raw text is displayed as a fallback.
        element.textContent = children;
      }
    } else {
      // If KaTeX scripts are not ready, just display the raw text content.
      element.textContent = children;
    }
  }, [children]);

  // We only pass className here. The content is managed via the ref and effect.
  return <div ref={containerRef} className={className} />;
};

export default LatexRenderer;