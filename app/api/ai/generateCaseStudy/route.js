import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { 
      moduleContent, 
      caseType = 'clinical',
      difficulty = 'intermediate',
      includeECG = true,
      patientAge = 'adult'
    } = await request.json();

    if (!moduleContent) {
      return NextResponse.json({ error: 'Module content is required' }, { status: 400 });
    }

    const systemPrompt = `You are a medical education expert specializing in ECG interpretation and clinical cardiology. 
    
    Generate a comprehensive case study based on the provided module content.
    
    Requirements:
    - Create a realistic clinical scenario appropriate for ${patientAge} patients
    - Case type: ${caseType}
    - Difficulty level: ${difficulty}
    - Include ECG interpretation: ${includeECG ? 'Yes' : 'No'}
    - Focus on practical clinical decision-making
    - Include step-by-step reasoning process
    - Provide multiple assessment points
    
    Case Study Structure:
    {
      "caseStudy": {
        "id": "unique_id",
        "title": "Case Study Title",
        "scenario": {
          "patientInfo": {
            "age": "age range",
            "gender": "gender",
            "chiefComplaint": "main complaint",
            "medicalHistory": "relevant history",
            "medications": "current medications",
            "vitalSigns": {
              "bloodPressure": "BP reading",
              "heartRate": "HR reading",
              "temperature": "temp reading",
              "respiratoryRate": "RR reading"
            }
          },
          "presentation": "detailed presentation",
          "initialAssessment": "initial findings"
        },
        "ecgData": {
          "description": "ECG findings description",
          "interpretation": "ECG interpretation",
          "keyFindings": ["finding1", "finding2"]
        },
        "questions": [
          {
            "id": 1,
            "question": "What is your initial diagnosis based on the presentation?",
            "type": "diagnosis|treatment|interpretation|management",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Detailed explanation",
            "difficulty": "basic|intermediate|advanced",
            "clinicalReasoning": "Step-by-step reasoning process"
          }
        ],
        "learningObjectives": ["objective1", "objective2"],
        "keyTakeaways": ["takeaway1", "takeaway2"],
        "difficulty": "${difficulty}",
        "estimatedTime": "15-20 minutes"
      }
    }
    
    Module Content: ${JSON.stringify(moduleContent)}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Generate a comprehensive ${caseType} case study with ${difficulty} difficulty level for ${patientAge} patients.`
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || '{}';
    
    // Parse and validate the JSON response
    let caseStudy;
    try {
      caseStudy = JSON.parse(response);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      caseStudy = generateFallbackCaseStudy(moduleContent, caseType, difficulty);
    }

    // Validate the structure
    if (!caseStudy.caseStudy) {
      caseStudy = generateFallbackCaseStudy(moduleContent, caseType, difficulty);
    }

    return NextResponse.json({
      success: true,
      caseStudy: caseStudy.caseStudy,
      metadata: {
        caseType: caseType,
        difficulty: difficulty,
        questionCount: caseStudy.caseStudy?.questions?.length || 0,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating case study:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate case study',
      caseStudy: generateFallbackCaseStudy({}, 'clinical', 'intermediate'),
      metadata: {
        caseType: 'clinical',
        difficulty: 'intermediate',
        questionCount: 3,
        generatedAt: new Date().toISOString()
      }
    });
  }
}

function generateFallbackCaseStudy(moduleContent, caseType, difficulty) {
  return {
    caseStudy: {
      id: `fallback_${Date.now()}`,
      title: `${caseType.charAt(0).toUpperCase() + caseType.slice(1)} ECG Case Study`,
      scenario: {
        patientInfo: {
          age: "45-65 years",
          gender: "Male",
          chiefComplaint: "Chest pain",
          medicalHistory: "Hypertension, diabetes",
          medications: "Metformin, Lisinopril",
          vitalSigns: {
            bloodPressure: "140/90 mmHg",
            heartRate: "85 bpm",
            temperature: "98.6°F",
            respiratoryRate: "18/min"
          }
        },
        presentation: "A patient presents with chest pain and ECG changes requiring interpretation.",
        initialAssessment: "Initial assessment reveals concerning ECG findings."
      },
      ecgData: {
        description: "ECG shows rhythm abnormalities and ST changes",
        interpretation: "ECG interpretation reveals potential cardiac issues",
        keyFindings: ["Rhythm abnormality", "ST segment changes"]
      },
      questions: [
        {
          id: 1,
          question: "What is the most likely diagnosis based on the ECG findings?",
          type: "diagnosis",
          options: [
            "Normal sinus rhythm",
            "Acute coronary syndrome",
            "Atrial fibrillation",
            "Ventricular tachycardia"
          ],
          correctAnswer: 1,
          explanation: "The ECG findings are consistent with acute coronary syndrome.",
          difficulty: difficulty,
          clinicalReasoning: "ECG changes suggest cardiac ischemia requiring immediate attention."
        },
        {
          id: 2,
          question: "What is the next most appropriate step in management?",
          type: "treatment",
          options: [
            "Discharge home",
            "Obtain cardiology consultation",
            "Start aspirin therapy",
            "Order chest X-ray"
          ],
          correctAnswer: 1,
          explanation: "Cardiology consultation is indicated for ECG abnormalities.",
          difficulty: difficulty,
          clinicalReasoning: "ECG changes require specialist evaluation and management."
        }
      ],
      learningObjectives: [
        "Interpret ECG findings in clinical context",
        "Apply clinical decision-making skills",
        "Understand emergency management protocols"
      ],
      keyTakeaways: [
        "ECG interpretation is crucial for cardiac assessment",
        "Clinical context guides diagnostic approach"
      ],
      difficulty: difficulty,
      estimatedTime: "15-20 minutes"
    }
  };
}

