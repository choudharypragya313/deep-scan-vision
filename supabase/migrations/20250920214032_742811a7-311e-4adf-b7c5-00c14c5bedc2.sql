-- Create storage bucket for uploaded images
INSERT INTO storage.buckets (id, name, public) VALUES ('image-uploads', 'image-uploads', false);

-- Create table for image analysis requests
CREATE TABLE public.image_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  image_path TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  analysis_options JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  results JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on image_analysis table
ALTER TABLE public.image_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for image_analysis
CREATE POLICY "Users can view their own analysis" 
ON public.image_analysis 
FOR SELECT 
USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can create analysis" 
ON public.image_analysis 
FOR INSERT 
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can update their own analysis" 
ON public.image_analysis 
FOR UPDATE 
USING (user_id IS NULL OR auth.uid() = user_id);

-- Create storage policies for image uploads
CREATE POLICY "Users can upload images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'image-uploads');

CREATE POLICY "Users can view uploaded images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'image-uploads');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_image_analysis_updated_at
BEFORE UPDATE ON public.image_analysis
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();