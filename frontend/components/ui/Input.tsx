interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-body-sm font-medium text-body">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3.5 py-2.5 bg-surface-dark-soft text-ink 
          border border-hairline rounded-md 
          placeholder:text-muted
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          text-body-md
          ${error ? 'border-error focus:ring-error/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-body-sm text-error">{error}</p>
      )}
    </div>
  );
}