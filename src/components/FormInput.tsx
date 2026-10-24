import { forwardRef } from "react";

import type { InputHTMLAttributes } from "react";
import styles from "@styles/Forms.module.css";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string;
  isInvalid?: boolean;
}

function parseMarkdownLinks(text: string): React.ReactNode[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const result: React.ReactNode[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.substring(lastIndex, match.index));
    }

    const linkText = match[1];
    const linkUrl = match[2];
    result.push(
      <a
        key={match.index}
        href={linkUrl}
        target={linkUrl.startsWith("#") ? undefined : "_blank"}
        rel="noreferrer"
      >
        {linkText}
      </a>,
    );

    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return result;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      name,
      label,
      errorMessage = "",
      isInvalid = false,
      className,
      ...props
    },
    ref,
  ) => {
    const inputId = id || name;
    const errorId = `${inputId}-error`;
    const isCurrentlyInvalid = isInvalid || Boolean(errorMessage);

    return (
      <div className={`${styles.inputGroup} ${className || ""}`.trim()}>
        <label htmlFor={inputId} className={styles.label}>
          <span>{parseMarkdownLinks(label)}</span>
        </label>
        <input
          id={inputId}
          name={name}
          ref={ref}
          aria-describedby={isCurrentlyInvalid ? errorId : undefined}
          aria-invalid={isCurrentlyInvalid}
          {...props}
          className={styles.input}
        />
        {isCurrentlyInvalid && errorMessage && (
          <p id={errorId} className={styles.errorMessage}>
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

export default FormInput;
