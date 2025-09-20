import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/Layout';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, Search, Shield, Download, Eye, MapPin, Clock } from 'lucide-react';

const uspCards = [
  {
    icon: FileText,
    title: 'Clear OCR',
    description: 'Extract text instantly from any image with advanced optical character recognition.',
  },
  {
    icon: Search,
    title: 'Reverse Lens',
    description: 'Find image matches across the web using powerful reverse image search.',
  },
  {
    icon: Shield,
    title: 'Tamper Check',
    description: 'Flag edits and AI-generated content with advanced detection algorithms.',
  },
  {
    icon: Download,
    title: 'Portable Report',
    description: 'Download comprehensive insights as a professional PDF report.',
  },
];

const toggleOptions = [
  { id: 'aiScore', label: 'AI score', icon: Shield },
  { id: 'editCheck', label: 'Edited/altered image check', icon: Eye },
  { id: 'imageInfo', label: 'Image information', icon: FileText },
  { id: 'imageMatches', label: 'Image matches', icon: Search },
  { id: 'location', label: 'Location of the image', icon: MapPin },
  { id: 'ocr', label: 'Recognize text in image (OCR)', icon: FileText },
  { id: 'timestamp', label: 'Timestamp', icon: Clock },
];

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [toggles, setToggles] = useState(
    toggleOptions.reduce((acc, option) => ({ ...acc, [option.id]: true }), {})
  );
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PNG or JPG image.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedImage(file);
      toast({
        title: "Image uploaded",
        description: "Your image is ready for analysis.",
      });
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to processing page with image and analysis options
    navigate('/processing', {
      state: {
        image: selectedImage,
        analysisOptions: toggles,
      },
    });
  };

  const toggleOption = (optionId: string) => {
    setToggles(prev => ({
      ...prev,
      [optionId]: !prev[optionId],
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to LUCID —{' '}
            <span className="neon-text bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              See Beyond the Surface
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered image analysis that reveals hidden insights, detects tampering, 
            and extracts valuable data from your images.
          </p>
        </div>

        {/* USP Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {uspCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.title}
                className="glass glass-hover animate-fade-in-up text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 animate-pulse-glow">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="neon-text">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Upload and Analysis Section */}
        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Upload Section */}
          <Card className="glass glass-hover animate-fade-in-up">
            <CardHeader>
              <CardTitle className="neon-text flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Image
              </CardTitle>
              <CardDescription>
                Upload a PNG or JPG image for analysis (max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer glass hover:bg-muted/20 transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-muted-foreground">
                    {selectedImage ? selectedImage.name : 'Click to upload'}
                  </span>
                </label>
              </div>

              {/* Image Preview */}
              {selectedImage && (
                <div className="animate-fade-in-up">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg neon-border"
                  />
                </div>
              )}

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                className="w-full glass neon-border hover:bg-primary/20 hover:text-primary-glow"
                disabled={!selectedImage}
              >
                Analyze Image
              </Button>
            </CardContent>
          </Card>

          {/* Analysis Options */}
          <Card className="glass glass-hover animate-fade-in-up">
            <CardHeader>
              <CardTitle className="neon-text">Analysis Options</CardTitle>
              <CardDescription>
                Select which features to include in your analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {toggleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/20"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-primary" />
                        <Label
                          htmlFor={option.id}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                      <Switch
                        id={option.id}
                        checked={toggles[option.id]}
                        onCheckedChange={() => toggleOption(option.id)}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Index;