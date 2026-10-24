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
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      const validationErrors = validate(formData);
      setErrors(validationErrors);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [formData, validate, debounceMs, isDirty]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    if (!isDirty) setIsDirty(true);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof T]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      await onSubmit(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  return { formData, setFormData, errors, handleChange, handleSubmit };
}
