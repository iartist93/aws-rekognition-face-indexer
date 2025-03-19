interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'blue' | 'green';
}

export function Button({ onClick, children, variant = 'blue' }: ButtonProps) {
  const baseClasses =
    'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
