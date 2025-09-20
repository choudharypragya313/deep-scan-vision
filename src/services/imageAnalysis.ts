import { supabase } from '@/integrations/supabase/client';

export interface AnalysisOptions {
  aiScore: boolean;
  editCheck: boolean;
  imageInfo: boolean;
  imageMatches: boolean;
  location: boolean;
  ocr: boolean;
  timestamp: boolean;
}

export interface AnalysisResult {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  results?: Record<string, any>;
  error_message?: string;
}

export class ImageAnalysisService {
  static async uploadAndAnalyze(file: File, options: AnalysisOptions, userId?: string): Promise<string> {
    try {
      // Upload image to storage
      const filename = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('image-uploads')
        .upload(filename, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Create analysis record
      const { data: analysis, error: insertError } = await supabase
        .from('image_analysis')
        .insert({
          user_id: userId || null,
          image_path: filename,
          filename: file.name,
          file_size: file.size,
          analysis_options: options as any,
          status: 'processing'
        })
        .select()
        .single();

      if (insertError || !analysis) {
        throw new Error(`Failed to create analysis record: ${insertError?.message}`);
      }

      // Trigger analysis via edge function
      const { error: functionError } = await supabase.functions.invoke('analyze-image', {
        body: {
          analysisId: analysis.id,
          analysisOptions: options
        }
      });

      if (functionError) {
        console.warn('Function invocation error:', functionError);
        // Don't throw here as the analysis record is created and can be polled
      }

      return analysis.id;
    } catch (error) {
      console.error('Upload and analyze error:', error);
      throw error;
    }
  }

  static async getAnalysisStatus(analysisId: string): Promise<AnalysisResult | null> {
    try {
      const { data, error } = await supabase
        .from('image_analysis')
        .select('id, status, results, error_message')
        .eq('id', analysisId)
        .single();

      if (error) {
        console.error('Error fetching analysis:', error);
        return null;
      }

      return data as AnalysisResult;
    } catch (error) {
      console.error('Get analysis status error:', error);
      return null;
    }
  }

  static async getImageUrl(imagePath: string): Promise<string | null> {
    try {
      const { data } = await supabase.storage
        .from('image-uploads')
        .createSignedUrl(imagePath, 3600); // 1 hour expiry

      return data?.signedUrl || null;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  }
}