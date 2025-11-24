import { Navigation } from '@/components/Navigation';
import { DashboardHero } from '@/components/DashboardHero';
import { DashboardContent } from '@/components/DashboardContent';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <DashboardHero />
        <DashboardContent />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              © 2025 IDATIS Organization. Empowering communities through
              volunteer service.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
