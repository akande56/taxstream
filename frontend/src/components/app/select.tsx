import { useEffect, useState } from "react";

export interface IOption {
  label: string;
  value: string;
}

export interface IProps {
  options: IOption[];
  placeholder: string;
  label?: string;
  error?: string;
  selectValue?: string;
  onChangeValue?: any;
}

export const AppSelect = (props: IProps) => {
  const [getOptions, setOptions] = useState<IOption[]>([]);

  useEffect(() => {
    setOptions(props.options);
  }, [props.options]);

  return (
    <div className="w-3/4 ">
      {props.label && (
        <label className="block text-sm font-medium mb-2 dark:text-white">
          {props.label}
        </label>
      )}
      <select
        onChange={props.onChangeValue}
        value={props.selectValue}
        className="py-3 px-4 pe-9 block w-full border-gray-500 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
      >
        <option>{props.placeholder}</option>
        {getOptions?.map((option, index: number) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {props.error && (
        <p className="text-sm text-red-600 mt-2">{props.error}</p>
      )}
    </div>
  );
};
