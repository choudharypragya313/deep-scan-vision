import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { X } from 'lucide-react';
import { ImageAnalysisService } from '@/services/imageAnalysis';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

const Processing = () => {
  const [progress, setProgress] = useState(0);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { toast } = useToast();

  // Get the uploaded image and analysis options from location state
  const uploadedImage = location.state?.image;
  const analysisOptions = location.state?.analysisOptions;

  useEffect(() => {
    if (!uploadedImage || !analysisOptions) {
      navigate('/');
      return;
    }

    let progressInterval: NodeJS.Timeout;
    let statusInterval: NodeJS.Timeout;

    const startAnalysis = async () => {
      try {
        // Start the upload and analysis
        const id = await ImageAnalysisService.uploadAndAnalyze(
          uploadedImage,
          analysisOptions,
          user?.id
        );
        setAnalysisId(id);

        // Start progress simulation
        progressInterval = setInterval(() => {
          setProgress(prev => {
            const increment = Math.random() * 10 + 5;
            return Math.min(prev + increment, 95); // Cap at 95% until we get results
          });
        }, 500);

        // Poll for completion
        statusInterval = setInterval(async () => {
          const result = await ImageAnalysisService.getAnalysisStatus(id);
          if (result?.status === 'completed') {
            clearInterval(progressInterval);
            clearInterval(statusInterval);
            setProgress(100);
            
            setTimeout(() => {
              navigate('/results', {
                state: {
                  analysisId: id,
                  image: uploadedImage,
                  results: result.results
                }
              });
            }, 500);
          } else if (result?.status === 'failed') {
            clearInterval(progressInterval);
            clearInterval(statusInterval);
            toast({
              variant: "destructive",
              title: "Analysis failed",
              description: result.error_message || "An error occurred during analysis.",
            });
            navigate('/');
          }
        }, 2000);

      } catch (error) {
        console.error('Analysis error:', error);
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: error instanceof Error ? error.message : "Failed to start analysis.",
        });
        navigate('/');
      }
    };

    startAnalysis();

    return () => {
      if (progressInterval) clearInterval(progressInterval);
      if (statusInterval) clearInterval(statusInterval);
    };
  }, [uploadedImage, analysisOptions, navigate, user, toast]);

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