import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface UseFormProps<T> {
  initialValues: T;
  validate: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void> | void;
  debounceMs?: number;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
  debounceMs = 500,
}: UseFormProps<T>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      const validationErrors = validate(formData);

      // Filter errors to only include fields the user has touched
      const touchedErrors: Partial<Record<keyof T, string>> = {};
      for (const key in validationErrors) {
        if (touched[key]) {
          touchedErrors[key] = validationErrors[key];
        }
      }

      setErrors(touchedErrors);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [formData, validate, debounceMs, isDirty, touched]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    if (!isDirty) setIsDirty(true);

    setFormData((prev) => ({ ...prev, [name]: value }));
    // Mark field as touched as soon as they type
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (errors[name as keyof T]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Optional but recommended: Mark as touched when an input loses focus
  const handleBlur = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(formData);

    // On submit, force all fields to be touched so all errors display
    const allTouched = Object.keys(initialValues).reduce(
      (acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      },
      {} as Partial<Record<keyof T, boolean>>,
    );
    setTouched(allTouched);

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      await onSubmit(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
