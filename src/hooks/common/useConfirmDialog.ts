import { useState, useCallback } from 'react';

export interface ConfirmDialogData {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void | Promise<void>;
}

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ConfirmDialogData | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const showDialog = useCallback((dialogData: ConfirmDialogData) => {
    setData(dialogData);
    setIsOpen(true);
  }, []);

  const hideDialog = useCallback(() => {
    setIsOpen(false);
    setData(null);
    setIsConfirming(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!data) return;

    setIsConfirming(true);
    try {
      await data.onConfirm();
      hideDialog();
    } catch (error) {
      console.error('Confirm action error:', error);
    } finally {
      setIsConfirming(false);
    }
  }, [data, hideDialog]);

  return {
    isOpen,
    data,
    isConfirming,
    showDialog,
    hideDialog,
    handleConfirm,
  };
};
