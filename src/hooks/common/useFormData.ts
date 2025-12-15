import { useState, useCallback } from 'react';

export interface UseFormDataOptions<T> {
  initialValues: T;
  onSubmit?: (data: T) => void | Promise<void>;
  validate?: (data: T) => Record<string, string> | null;
}

export const useFormData = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate
}: UseFormDataOptions<T>) => {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldError = useCallback((field: keyof T | string, message: string) => {
    setErrors(prev => ({ ...prev, [field as string]: message }));
  }, []);

  const setErrorsFn = useCallback((newErrors: Record<string, string>) => {
    setErrors(newErrors);
  }, []);

  const validateForm = useCallback(() => {
    if (!validate) return true;
    
    const validationErrors = validate(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return false;
    }
    
    setErrors({});
    return true;
  }, [formData, validate]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm() || !onSubmit) return false;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit]);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    updateFormData,
    resetForm,
    validateForm,
    handleSubmit,
    setFieldError,
    setErrors: setErrorsFn,
  };
};