import { useState, useCallback } from 'react';

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);

      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);

      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
        document.body.removeChild(textArea);
        return true;
      } catch (fallbackErr) {
        console.error('Fallback: Unable to copy', fallbackErr);
        document.body.removeChild(textArea);
        return false;
      }
    }
  }, []);

  return { copied, copyToClipboard };
};

// Usage example:
/*
import { useCopyToClipboard } from './hooks/useCopyToClipboard';

function MyComponent() {
  const { copied, copyToClipboard } = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard('Text to copy');
  };

  return (
    <button onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
*/