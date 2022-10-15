import React from "react";
import { useFormContext } from "react-hook-form";

type FormInputProps = {
  label?: string;
  name: string;
  type?: string;
  hidden?: boolean;
  value?: any;
  autoComplete?: string | undefined;
  onChange?: (event: any) => any;
  placeholder?: string;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  placeholder,
  hidden,
  value,
  autoComplete,
  onChange,
  type = "text",
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="">
      <div className="block mb-4">
        {label && (
          <label className=" text-gray-700 text-sm font-bold" htmlFor={name}>
            {label}
          </label>
        )}
        {errors[name] && (
          <span className="text-red-500 text-xs pt-1 block">
            {errors[name]?.message as unknown as string}
          </span>
        )}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        hidden={hidden}
        value={value}
        autoComplete={autoComplete}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        {...register(name, {
          value,
          onChange: onChange ?? ((event: any) => {}),
        })}
      />
    </div>
  );
};

export default FormInput;
