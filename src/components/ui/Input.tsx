interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export function Input({ label, value, onChange, placeholder }: InputProps) {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700'>{label}</label>
      <input
        type='text'
        value={value}
        onChange={onChange}
        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
        placeholder={placeholder}
      />
    </div>
  );
}
