import { Navigation } from '@/components/Navigation';

interface PageLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-2">{description}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
