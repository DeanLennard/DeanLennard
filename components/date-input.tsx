"use client";

import type { InputHTMLAttributes } from "react";
import { useRef } from "react";

type DateInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

type DateInputElement = HTMLInputElement & {
  showPicker?: () => void;
};

export function DateInput(props: DateInputProps) {
  const inputRef = useRef<DateInputElement | null>(null);

  const openPicker = () => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.focus();

    if (typeof input.showPicker === "function") {
      try {
        input.showPicker();
      } catch {
        // Some browsers require a stricter user gesture than focus provides.
      }
    }
  };

  return (
    <input
      {...props}
      ref={inputRef}
      type="date"
      onClick={(event) => {
        props.onClick?.(event);
        openPicker();
      }}
    />
  );
}
