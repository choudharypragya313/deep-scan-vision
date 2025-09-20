import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return false;
    }

    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (!password.trim() || password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Simulate login/register success
    const success = login(name, email, password);
    
    if (!success) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials.",
      });
      return;
    }
    
    toast({
      title: isLogin ? "Welcome back!" : "Account created!",
      description: `Hello ${name}, you're now logged in.`,
    });

    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md glass glass-hover animate-fade-in-up">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl neon-text">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin 
                ? 'Sign in to access LUCID image analysis' 
                : 'Join LUCID to analyze your images'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="glass neon-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="glass neon-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="glass neon-border"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full glass neon-border hover:bg-primary/20 hover:text-primary-glow transition-all"
              >
                {isLogin ? 'Login' : 'Register'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {isLogin 
                    ? "Don't have an account? Register" 
                    : "Already have an account? Login"
                  }
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;