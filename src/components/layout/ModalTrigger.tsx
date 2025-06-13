
"use client";

import { useState, useEffect } from 'react';
import WelcomeModal from './WelcomeModal';

const MODAL_SEEN_KEY = 'idreamWelcomeModalSeen';

export default function ModalTrigger() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // Only attempt to access localStorage if running in a browser environment
    if (typeof window !== 'undefined') {
      try {
        const modalSeen = localStorage.getItem(MODAL_SEEN_KEY);
        if (!modalSeen) {
          setIsModalOpen(true);
        }
      } catch (error) {
        console.warn("Could not access localStorage for welcome modal:", error);
        // Fallback: show modal if localStorage is inaccessible, as we can't track if it's been seen.
        // This is important for environments where localStorage might be restricted.
        setIsModalOpen(true); 
      }
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(MODAL_SEEN_KEY, 'true');
      } catch (error) {
        console.warn("Could not set localStorage for welcome modal:", error);
      }
    }
  };
  
  // Ensure this component only renders on the client after mounting.
  // This prevents hydration errors if the initial state (isModalOpen)
  // differs between server and client before localStorage is checked.
  if (!hasMounted) {
      return null;
  }

  return <WelcomeModal isOpen={isModalOpen} onClose={handleCloseModal} />;
}
