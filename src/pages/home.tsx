import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/hooks/redux';

export function Home() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Welcome to Our AI Agent Platform
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Create, customize, and deploy AI agents for your business needs.
            </p>
          </div>
          <div className="space-x-4">
            {isAuthenticated ? (
              <Button asChild size="lg">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}