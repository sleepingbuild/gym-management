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
  const baseStyles = 'font-button rounded-md transition-colors font-medium';
  
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-active disabled:bg-primary-disabled disabled:cursor-not-allowed',
    secondary: 'bg-canvas text-ink border border-hairline hover:bg-surface-soft',
    ghost: 'bg-transparent text-ink hover:bg-surface-soft',
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