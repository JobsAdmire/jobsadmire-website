'use client';
import { useRef, type ChangeEvent, type KeyboardEvent } from 'react';
import { CloseIcon } from '@/design/chrome/icons';

export type SearchInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  clearLabel: string;
  /** Localized result line ("3 articles"), announced politely as it changes. */
  resultText?: string;
  hideLabel?: boolean;
  className?: string;
};

export function SearchInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  clearLabel,
  resultText,
  hideLabel = false,
  className,
}: SearchInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const clear = () => {
    onChange('');
    ref.current?.focus();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && value) {
      e.preventDefault();
      clear();
    }
  };
  return (
    <div className={['flex flex-col gap-1', className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'text-body-sm font-bold'}>
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          className="min-h-[44px] w-full rounded-input border border-border-1 bg-white py-2 pl-4 pr-12 text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe [&::-webkit-search-cancel-button]:hidden"
        />
        {value ? (
          <button
            type="button"
            onClick={clear}
            aria-label={clearLabel}
            className="absolute right-1 top-1/2 inline-flex min-h-[36px] min-w-[36px] -translate-y-1/2 items-center justify-center rounded-pill text-text-secondary hover:bg-pale-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-safe"
          >
            <CloseIcon size={16} />
          </button>
        ) : null}
      </div>
      <p
        role="status"
        aria-live="polite"
        className="min-h-[1.25rem] text-body-sm text-text-secondary"
      >
        {resultText}
      </p>
    </div>
  );
}
