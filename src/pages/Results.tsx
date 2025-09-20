import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { useUser } from '@/contexts/UserContext';
import { Copy, Download, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FeedbackSection } from '@/components/FeedbackSection';
import { ImageAnalysisService } from '@/services/imageAnalysis';
import { supabase } from '@/integrations/supabase/client';

const Results = () => {
  const [results, setResults] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const uploadedImage = location.state?.image;
  const analysisId = location.state?.analysisId;
  const analysisResults = location.state?.results;

  useEffect(() => {
    if (!uploadedImage && !analysisId) {
      navigate('/');
      return;
    }

    // If we have analysis results from the backend, use them
    if (analysisResults) {
      const formattedResults = Object.entries(analysisResults).map(([key, value]) => {
        const labelMap: Record<string, string> = {
          aiScore: 'AI Score',
          editCheck: 'Edited/Altered Image Check',
          imageInfo: 'Image Information',
          imageMatches: 'Image Matches',
          location: 'Location',
          ocr: 'OCR Text',
          timestamp: 'Timestamp',
        };
        
        return {
          label: labelMap[key] || key,
          value: value as string
        };
      });

      // Animate results with staggered fade-in
      formattedResults.forEach((result, index) => {
        setTimeout(() => {
          setResults(prev => [...prev, result]);
        }, index * 200);
      });
    }

    // If we have an analysis ID, get the image URL from storage
    if (analysisId) {
      const fetchImageUrl = async () => {
        try {
          const { data } = await supabase
            .from('image_analysis')
            .select('image_path')
            .eq('id', analysisId)
            .single();

          if (data?.image_path) {
            const url = await ImageAnalysisService.getImageUrl(data.image_path);
            setImageUrl(url);
          }
        } catch (error) {
          console.error('Error fetching image URL:', error);
        }
      };
      
      fetchImageUrl();
    }
  }, [uploadedImage, analysisId, analysisResults, navigate]);

  const handleCopyTimestamp = () => {
    const timestamp = new Date().toLocaleString();
    navigator.clipboard.writeText(timestamp);
    toast({
      title: "Copied!",
      description: "Timestamp copied to clipboard.",
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Downloaded",
      description: "Your analysis report has been downloaded.",
    });
  };

  const handleAnalyzeAnother = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        {/* Welcome Message */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-4">
            {user ? (
              <>Welcome back, <span className="neon-text">{user.name}</span>. Here are your results.</>
            ) : (
              <>Your <span className="neon-text">Analysis Results</span></>
            )}
          </h1>
        </div>

        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Image Preview */}
          <div className="glass glass-hover animate-fade-in-up">
            <CardHeader>
              <CardTitle className="neon-text">Analyzed Image</CardTitle>
            </CardHeader>
            <CardContent>
              {uploadedImage ? (
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt="Analyzed"
                  className="w-full h-64 object-cover rounded-lg neon-border"
                />
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Analyzed"
                  className="w-full h-64 object-cover rounded-lg neon-border"
                />
              ) : (
                <div className="w-full h-64 bg-muted rounded-lg neon-border flex items-center justify-center">
                  <p className="text-muted-foreground">Loading image...</p>
                </div>
              )}
            </CardContent>
          </div>

          {/* Results */}
          <div className="glass glass-hover animate-fade-in-up">
            <CardHeader>
              <CardTitle className="neon-text">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={result.label}
                  className="animate-stagger-fade p-3 rounded-lg bg-muted/20 border border-border/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-primary">{result.label}:</span>
                    <span className="text-muted-foreground text-right flex-1 ml-2">
                      {result.value}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-8 flex flex-wrap gap-4 justify-center animate-fade-in-up">
          <Button
            onClick={handleDownloadPDF}
            className="glass neon-border hover:bg-primary/20"
          >
            <Download className="h-4 w-4 mr-2" />
            Download as PDF
          </Button>

          <Button
            onClick={handleCopyTimestamp}
            className="glass neon-border hover:bg-primary/20"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Timestamp
          </Button>

          <Button
            onClick={handleAnalyzeAnother}
            className="glass neon-border hover:bg-primary/20"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Analyze Another
          </Button>
        </div>

        {/* Feedback Section */}
        <div className="max-w-2xl mx-auto mt-12">
          <FeedbackSection />
        </div>
      </div>
    </Layout>
  );
};

export default Results;