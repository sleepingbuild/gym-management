interface CardProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function Card({ children, className = '', dark = false }: CardProps) {
  const baseClass = dark
    ? 'bg-surface-dark text-on-dark'
    : 'bg-surface-card text-ink';
  
  return (
    <div className={`rounded-lg p-6 md:p-8 ${baseClass} ${className}`}>
      {children}
    </div>
  );
}