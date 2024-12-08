// src/components/common/InputField.tsx

import { InputHTMLAttributes, forwardRef } from "react";
import { FieldError } from "react-hook-form";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError | string;
  name?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, name, ...rest }, ref) => {
    return (
      <div className="mb-4">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor={name}
        >
          {label}
        </label>
        <input
          id={name}
          name={name}
          ref={ref}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...rest}
        />
        {error && (
          <p className="text-red-500 text-sm mt-1">
            {typeof error === "string" ? error : error.message}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
