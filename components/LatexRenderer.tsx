import React, { useLayoutEffect, useRef } from 'react';

declare global {
  interface Window {
    renderMathInElement: (element: HTMLElement, options?: any) => void;
  }
}

interface LatexRendererProps {
  children: string;
  className?: string;
}

const LatexRenderer: React.FC<LatexRendererProps> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // useLayoutEffect to run synchronously after all DOM mutations.
  // This is better for DOM manipulations that need to be visible right away, preventing content flicker.
  useLayoutEffect(() => {
    const element = containerRef.current;
    if (element && window.renderMathInElement) {
      // Set raw text content. The auto-renderer will parse this.
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
      }
    }
  }, [children]);

  // We only pass className here. The content is managed via the ref and effect.
  return <div ref={containerRef} className={className} />;
};

export default LatexRenderer;
