import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { useUser } from '@/contexts/UserContext';
import { Copy, Download, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FeedbackSection } from '@/components/FeedbackSection';

const Results = () => {
  const [results, setResults] = useState<any[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const uploadedImage = location.state?.image;
  const analysisData = location.state?.analysisData;

  useEffect(() => {
    if (!uploadedImage) {
      navigate('/');
      return;
    }

    // Generate mock results based on enabled toggles
    const mockResults = [
      { label: 'AI Score', value: '72%', enabled: analysisData?.aiScore },
      { label: 'Edited/Altered Image Check', value: 'No edits detected', enabled: analysisData?.editCheck },
      { label: 'Image Information', value: 'JPEG, 1920x1080, 2.4MB', enabled: analysisData?.imageInfo },
      { label: 'Image Matches', value: '3 similar images found online', enabled: analysisData?.imageMatches },
      { label: 'Location', value: 'GPS data not available', enabled: analysisData?.location },
      { label: 'OCR Text', value: 'Sample text extracted from image...', enabled: analysisData?.ocr },
      { label: 'Timestamp', value: new Date().toLocaleString(), enabled: analysisData?.timestamp },
    ].filter(result => result.enabled);

    // Animate results with staggered fade-in
    mockResults.forEach((result, index) => {
      setTimeout(() => {
        setResults(prev => [...prev, result]);
      }, index * 200);
    });
  }, [uploadedImage, analysisData, navigate]);

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
              {uploadedImage && (
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt="Analyzed"
                  className="w-full h-64 object-cover rounded-lg neon-border"
                />
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