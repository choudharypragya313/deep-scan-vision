import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { LogOut } from 'lucide-react';
import lucidLogo from '@/assets/lucid-logo.jpg';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/20 backdrop-blur-lg bg-card/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo and Home Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 group"
            >
              <img 
                src={lucidLogo} 
                alt="LUCID" 
                className="h-10 w-10 rounded-lg glass-hover"
              />
              <span className="text-2xl font-bold neon-text group-hover:text-primary-glow transition-colors">
                LUCID
              </span>
            </button>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">
                  Hi, <span className="text-primary font-medium">{user.name}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-primary"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                className="glass neon-border hover:bg-primary/20"
              >
                Login / Register
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};