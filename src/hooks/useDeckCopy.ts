import { useState } from 'react';
import { Deck } from '@/types/hearthstone';

export default function useDeckCopy() {
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const copyDeck = async (deck: Deck): Promise<boolean> => {
    if (!deck.deckCode) return false;

    setIsCopying(true);
    setCopySuccess(false);

    try {
      await navigator.clipboard.writeText(deck.deckCode);
      setCopySuccess(true);

      // Reset success state after 2 seconds
      setTimeout(() => setCopySuccess(false), 2000);

      return true;
    } catch (error) {
      console.error('Failed to copy deck code:', error);
      return false;
    } finally {
      setIsCopying(false);
    }
  };

  return {
    copyDeck,
    isCopying,
    copySuccess
  };
}