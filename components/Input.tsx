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
}) => {
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
              focus:ring-2
              focus:ring-sky-600
              sm:text-sm
              sm:leading-6
            `,
              errors[id] && "focus:ring-rose-500",
              disabled && "opacity-50 cursor-default"
            )}
            id={id}
            autoComplete={id}
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
            focus:ring-2
            focus:ring-sky-600
            sm:text-sm
            sm:leading-6
        `,
              errors[id] && "focus:ring-rose-500",
              disabled && "opacity-50 cursor-default"
            )}
            id={id}
            type={type}
            autoComplete={id}
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
