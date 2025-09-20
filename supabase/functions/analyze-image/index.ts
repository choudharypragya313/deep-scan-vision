import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { analysisId, analysisOptions } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the analysis record
    const { data: analysis, error: fetchError } = await supabaseClient
      .from('image_analysis')
      .select('*')
      .eq('id', analysisId)
      .single()

    if (fetchError || !analysis) {
      throw new Error('Analysis record not found')
    }

    // Simulate AI analysis (replace with real AI service)
    const mockResults: Record<string, any> = {}
    
    if (analysisOptions.aiScore) {
      mockResults.aiScore = `${Math.floor(Math.random() * 40) + 60}%`
    }
    
    if (analysisOptions.editCheck) {
      mockResults.editCheck = Math.random() > 0.7 ? 'Edits detected' : 'No edits detected'
    }
    
    if (analysisOptions.imageInfo) {
      mockResults.imageInfo = `${analysis.filename}, ${Math.floor(analysis.file_size / 1024)}KB`
    }
    
    if (analysisOptions.imageMatches) {
      mockResults.imageMatches = `${Math.floor(Math.random() * 10)} similar images found online`
    }
    
    if (analysisOptions.location) {
      mockResults.location = Math.random() > 0.5 ? 'GPS data not available' : 'Location: New York, NY'
    }
    
    if (analysisOptions.ocr) {
      mockResults.ocr = 'Sample text extracted from image...'
    }
    
    if (analysisOptions.timestamp) {
      mockResults.timestamp = new Date().toLocaleString()
    }

    // Update the analysis record with results
    const { error: updateError } = await supabaseClient
      .from('image_analysis')
      .update({
        status: 'completed',
        results: mockResults
      })
      .eq('id', analysisId)

    if (updateError) {
      throw updateError
    }

    return new Response(
      JSON.stringify({ success: true, results: mockResults }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})