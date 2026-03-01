"use client";

import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { InputType } from "@/utils/types";

interface InputProps {
  label?: string;
  id: string;
  type?: InputType;
  required?: boolean;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  autoComplete?: string;
  spellCheck?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type,
  required,
  placeholder,
  register,
  errors,
  disabled,
  autoComplete,
  spellCheck,
}) => {
  const effectiveAutoComplete = autoComplete ?? (id === "email" || id === "password" ? id : undefined);
  return (
    <div>
      {label && (
        <label className="block text-md font-medium leading-6" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="mt-2">
        {type === "textarea" ? (
          <textarea
            className={clsx(
              `
              block
              w-full
              border-0
              py-1.5
              px-3
              shadow-sm
              ring-1
              ring-inset
              bg-transparent
              placeholder:text-gray-400
              focus-visible:ring-2
              focus-visible:ring-sky-600
              focus-visible:outline-none
              sm:text-sm
              sm:leading-6
            `,
              errors[id] && "focus-visible:ring-rose-500",
              disabled && "opacity-50 cursor-default"
            )}
            id={id}
            autoComplete={effectiveAutoComplete}
            spellCheck={spellCheck}
            disabled={disabled}
            placeholder={placeholder}
            {...register(id, { required })}
          />
        ) : (
          <input
            className={clsx(
              `
            block
            w-full
            border-0
            py-1.5
            px-3
            shadow-sm
            ring-1
            ring-inset
            bg-transparent
            placeholder:text-gray-400
            focus-visible:ring-2
            focus-visible:ring-sky-600
            focus-visible:outline-none
            sm:text-sm
            sm:leading-6
        `,
              errors[id] && "focus-visible:ring-rose-500",
              disabled && "opacity-50 cursor-default"
            )}
            id={id}
            type={type}
            autoComplete={effectiveAutoComplete}
            spellCheck={spellCheck}
            disabled={disabled}
            placeholder={placeholder}
            {...register(id, { required })}
          />
        )}
      </div>
    </div>
  );
};

export default Input;
