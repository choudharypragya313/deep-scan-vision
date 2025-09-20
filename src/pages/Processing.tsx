import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { X } from 'lucide-react';

const Processing = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the uploaded image from location state
  const uploadedImage = location.state?.image;

  useEffect(() => {
    if (!uploadedImage) {
      navigate('/');
      return;
    }

    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Navigate to results after processing completes
          setTimeout(() => {
            navigate('/results', {
              state: {
                image: uploadedImage,
                analysisData: location.state?.analysisData
              }
            });
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [uploadedImage, navigate, location.state]);

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
        <div className="glass glass-hover animate-fade-in-up max-w-md w-full p-8 text-center">
          {/* Processing Animation */}
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-muted opacity-20"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-loader-spin"
              ></div>
              <div className="absolute inset-4 rounded-full bg-primary/20 animate-pulse-glow"></div>
            </div>
          </div>

          {/* Status Text */}
          <h2 className="text-2xl font-bold neon-text mb-2">
            Your image is being processed...
          </h2>
          
          <p className="text-muted-foreground mb-6">
            This may take a few seconds depending on image size.
          </p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-300 ease-out rounded-full"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(progress)}% complete
            </p>
          </div>

          {/* Cancel Button */}
          <Button
            onClick={handleCancel}
            variant="ghost"
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Processing;