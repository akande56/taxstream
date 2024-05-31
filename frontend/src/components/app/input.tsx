/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IProps {
  placeholder: string;
  label?: string;
  error?: string;
  inputValue?: string;
  onChangeValue?: any;
}

export const AppInput = (props: IProps) => {
  return (
    <div className="max-w-sm">
      {props.label && (
        <label className="block text-sm font-medium mb-2 dark:text-white">
          {props.label}
        </label>
      )}
      <input
        type="email"
        onChange={props.onChangeValue}
        value={props.inputValue}
        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        placeholder={props.placeholder}
      />
      {props.error && (
        <p className="text-sm text-red-600 mt-2">{props.error}</p>
      )}
    </div>
  );
};
