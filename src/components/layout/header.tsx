import type { FC } from 'react';
import { Building2 } from 'lucide-react';

export const Header: FC = () => {
  return (
    <header className="border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
              CityWise AI
            </h1>
          </div>
          <p className="hidden md:block text-sm text-muted-foreground">
            AI-Powered Urban Planning
          </p>
        </div>
      </div>
    </header>
  );
};
