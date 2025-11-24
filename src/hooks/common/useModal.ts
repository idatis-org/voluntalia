import { useState, useCallback } from 'react';

export interface UseModalOptions<T = any> {
  onClose?: () => void;
  onOpen?: (data?: T) => void;
}

export const useModal = <T = any>(options: UseModalOptions<T> = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const openModal = useCallback(
    (modalData?: T) => {
      setData(modalData || null);
      setIsOpen(true);
      options.onOpen?.(modalData);
    },
    [options]
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
    options.onClose?.();
  }, [options]);

  const toggleModal = useCallback(() => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  }, [isOpen, openModal, closeModal]);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal,
  };
};
