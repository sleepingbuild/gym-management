interface CardProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function Card({ children, className = '', dark = false }: CardProps) {
  const baseClass = dark
    ? 'bg-surface-dark text-on-dark border border-hairline'
    : 'bg-surface-card text-ink border border-hairline';

  return (
    <div
      className={`rounded-lg p-6 md:p-8 transition-colors duration-150 hover:border-primary/40 ${baseClass} ${className}`}
    >
      {children}
    </div>
  );
}