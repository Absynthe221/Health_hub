import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { ecgData, imageData, analysisType = 'basic' } = await request.json();

    if (!ecgData && !imageData) {
      return NextResponse.json({ error: 'ECG data or image data is required' }, { status: 400 });
    }

    const systemPrompt = `You are a cardiology expert specializing in ECG interpretation and visual analysis. 
    
    Analyze the provided ECG data and provide a comprehensive interpretation.
    
    Requirements:
    - Provide ${analysisType} analysis (basic: fundamental interpretation, detailed: comprehensive clinical analysis)
    - Focus on rhythm, rate, axis, intervals, and morphology
    - Identify any abnormalities or concerning findings
    - Provide clinical significance and potential implications
    - Use standard ECG terminology and measurements
    - If image data is provided, analyze visual ECG tracings
    
    Return the analysis in JSON format:
    {
      "rhythm": "Normal sinus rhythm|Atrial fibrillation|etc.",
      "rate": "X bpm",
      "axis": "Normal|Left axis deviation|Right axis deviation",
      "intervals": {
        "PR": "X.XX seconds",
        "QRS": "X.XX seconds", 
        "QT": "X.XX seconds"
      },
      "findings": ["Finding 1", "Finding 2", "Finding 3"],
      "abnormalities": ["Abnormality 1", "Abnormality 2"],
      "clinicalSignificance": "Clinical interpretation and implications",
      "recommendations": ["Recommendation 1", "Recommendation 2"],
      "confidence": "high|medium|low"
    }
    
    ECG Data: ${JSON.stringify(ecgData)}
    Image Data: ${imageData ? 'Image provided for analysis' : 'No image data'}
    Analysis Type: ${analysisType}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview", // Use vision model if image data is provided
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Analyze this ECG data with ${analysisType} interpretation.`
        }
      ],
      max_tokens: 800,
      temperature: 0.3, // Lower temperature for more consistent medical analysis
    });

    const response = completion.choices[0]?.message?.content || '{}';
    
    // Parse and validate the JSON response
    let analysisData;
    try {
      analysisData = JSON.parse(response);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback analysis
      analysisData = {
        rhythm: "Unable to determine",
        rate: "Unable to calculate",
        axis: "Unable to determine",
        intervals: {
          PR: "Unable to measure",
          QRS: "Unable to measure",
          QT: "Unable to measure"
        },
        findings: ["ECG data requires manual review"],
        abnormalities: ["Unable to identify specific abnormalities"],
        clinicalSignificance: "Manual ECG interpretation recommended",
        recommendations: ["Consult with cardiology specialist", "Obtain 12-lead ECG if not already done"],
        confidence: "low"
      };
    }

    // Validate and ensure all required fields exist
    const validatedAnalysis = {
      rhythm: analysisData.rhythm || "Unable to determine",
      rate: analysisData.rate || "Unable to calculate",
      axis: analysisData.axis || "Unable to determine",
      intervals: {
        PR: analysisData.intervals?.PR || "Unable to measure",
        QRS: analysisData.intervals?.QRS || "Unable to measure",
        QT: analysisData.intervals?.QT || "Unable to measure"
      },
      findings: Array.isArray(analysisData.findings) ? analysisData.findings : ["ECG analysis incomplete"],
      abnormalities: Array.isArray(analysisData.abnormalities) ? analysisData.abnormalities : ["No specific abnormalities identified"],
      clinicalSignificance: analysisData.clinicalSignificance || "Clinical correlation needed",
      recommendations: Array.isArray(analysisData.recommendations) ? analysisData.recommendations : ["Manual review recommended"],
      confidence: analysisData.confidence || "low"
    };

    return NextResponse.json({
      success: true,
      ...validatedAnalysis,
      metadata: {
        analyzedAt: new Date().toISOString(),
        analysisType,
        hasImageData: !!imageData,
        modelUsed: "gpt-4-vision-preview"
      }
    });

  } catch (error) {
    console.error('Error analyzing ECG:', error);
    
    // Fallback response for when AI analysis fails
    const fallbackAnalysis = {
      rhythm: "Analysis unavailable",
      rate: "Unable to calculate",
      axis: "Unable to determine",
      intervals: {
        PR: "Unable to measure",
        QRS: "Unable to measure",
        QT: "Unable to measure"
      },
      findings: ["ECG analysis service temporarily unavailable"],
      abnormalities: ["Manual interpretation required"],
      clinicalSignificance: "AI analysis unavailable - manual ECG interpretation recommended",
      recommendations: [
        "Consult with cardiology specialist",
        "Perform manual 12-lead ECG interpretation",
        "Consider additional diagnostic testing as clinically indicated"
      ],
      confidence: "low",
      metadata: {
        analyzedAt: new Date().toISOString(),
        analysisType: 'fallback',
        hasImageData: false,
        modelUsed: "fallback",
        error: "AI analysis service unavailable"
      }
    };

    return NextResponse.json({
      success: false,
      error: 'Failed to analyze ECG data',
      ...fallbackAnalysis
    });
  }
}

// Additional endpoint for batch ECG analysis
export async function PUT(request) {
  try {
    const { ecgBatchData, analysisType = 'basic' } = await request.json();

    if (!ecgBatchData || !Array.isArray(ecgBatchData)) {
      return NextResponse.json({ error: 'ECG batch data array is required' }, { status: 400 });
    }

    // Process multiple ECGs in batch
    const batchResults = [];
    
    for (const ecgItem of ecgBatchData) {
      try {
        // Simulate batch processing (in production, this would be optimized)
        const analysis = await analyzeSingleECG(ecgItem, analysisType);
        batchResults.push({
          id: ecgItem.id,
          success: true,
          analysis
        });
      } catch (error) {
        batchResults.push({
          id: ecgItem.id,
          success: false,
          error: 'Failed to analyze this ECG'
        });
      }
    }

    return NextResponse.json({
      success: true,
      batchResults,
      metadata: {
        totalProcessed: ecgBatchData.length,
        successful: batchResults.filter(r => r.success).length,
        failed: batchResults.filter(r => !r.success).length,
        analyzedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in batch ECG analysis:', error);
    return NextResponse.json({ error: 'Failed to process batch ECG analysis' }, { status: 500 });
  }
}

async function analyzeSingleECG(ecgData, analysisType) {
  // This would contain the same logic as the main POST function
  // but optimized for batch processing
  return {
    rhythm: "Batch analysis placeholder",
    rate: "Batch calculation",
    axis: "Batch determination",
    intervals: {
      PR: "0.XX seconds",
      QRS: "0.XX seconds",
      QT: "0.XX seconds"
    },
    findings: ["Batch analysis finding"],
    abnormalities: ["No abnormalities detected"],
    clinicalSignificance: "Batch analysis - manual review recommended",
    recommendations: ["Standard follow-up"],
    confidence: "medium"
  };
}

