interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-button rounded-md transition-all duration-150 font-medium';

  const variants = {
    primary:
      'bg-primary text-on-primary shadow-glow hover:bg-primary-active hover:shadow-glow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:bg-primary-disabled disabled:text-muted disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0',
    secondary:
      'bg-transparent text-ink border border-hairline hover:border-primary hover:text-primary',
    ghost: 'bg-transparent text-ink hover:bg-surface-card',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-3 text-button',
    lg: 'px-6 py-3.5 text-button',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}