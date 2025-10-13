import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Try to read the ECG modules from the data directory
    const dataPath = path.join(process.cwd(), 'data', 'ecg-modules.json');
    
    if (fs.existsSync(dataPath)) {
      const ecgModules = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return NextResponse.json({
        success: true,
        modules: ecgModules,
        count: ecgModules.length
      });
    } else {
      // Fallback: return sample ECG modules
      const sampleModules = [
        {
          id: "1",
          title: "ECG Fundamentals",
          description: "Learn the basics of electrocardiography",
          overview: "This module covers the fundamental concepts of ECG interpretation, including heart anatomy, electrical conduction, and basic rhythm recognition.",
          objectives: [
            "Understand heart anatomy and electrical conduction system",
            "Identify normal ECG components (P, QRS, T waves)",
            "Recognize basic cardiac rhythms and their characteristics",
            "Apply proper electrode placement techniques",
            "Interpret basic ECG measurements and intervals"
          ],
          duration: 120,
          difficulty: "Beginner",
          prerequisites: "Basic anatomy knowledge recommended",
          slides: [
            {
              name: "Introduction to ECG",
              content: "Welcome to ECG Fundamentals. In this module, you'll learn the basics of electrocardiography.",
              description: "Overview of ECG basics and importance in clinical practice"
            },
            {
              name: "Heart Anatomy",
              content: "Understanding the heart's structure is essential for ECG interpretation.",
              description: "Detailed look at cardiac anatomy and electrical conduction pathways"
            },
            {
              name: "ECG Components",
              content: "Learn to identify P, QRS, and T waves and their clinical significance.",
              description: "Breaking down the components of a normal ECG waveform"
            },
            {
              name: "Basic Rhythms",
              content: "Recognize normal sinus rhythm and common variations.",
              description: "Introduction to normal cardiac rhythms and their characteristics"
            }
          ],
          videos: [
            {
              title: "ECG Basics Overview",
              url: "/assets/module1/videos/basics.mp4",
              description: "Introduction to electrocardiography fundamentals"
            }
          ]
        },
        {
          id: "2",
          title: "Arrhythmia Recognition",
          description: "Identify and classify cardiac arrhythmias",
          overview: "This module focuses on recognizing various types of cardiac arrhythmias, their causes, and clinical significance.",
          objectives: [
            "Identify different types of cardiac arrhythmias",
            "Understand the mechanisms behind arrhythmias",
            "Recognize life-threatening rhythms",
            "Apply systematic approach to rhythm analysis"
          ],
          duration: 180,
          difficulty: "Intermediate",
          prerequisites: "ECG Fundamentals completion recommended",
          slides: [
            {
              name: "Arrhythmia Overview",
              content: "Introduction to cardiac arrhythmias and their classification.",
              description: "Understanding what constitutes an arrhythmia"
            },
            {
              name: "Atrial Arrhythmias",
              content: "Learn to identify atrial fibrillation, flutter, and other atrial rhythms.",
              description: "Focus on atrial rhythm disturbances"
            },
            {
              name: "Ventricular Arrhythmias",
              content: "Recognize ventricular tachycardia, fibrillation, and other dangerous rhythms.",
              description: "Critical ventricular rhythm identification"
            },
            {
              name: "Conduction Blocks",
              content: "Understand AV blocks and bundle branch blocks.",
              description: "Electrical conduction system abnormalities"
            }
          ]
        },
        {
          id: "3",
          title: "Advanced ECG Interpretation",
          description: "Master complex ECG patterns and clinical correlations",
          overview: "Advanced techniques for ECG interpretation including axis determination, hypertrophy patterns, and ischemic changes.",
          objectives: [
            "Determine electrical axis from ECG",
            "Identify chamber enlargement patterns",
            "Recognize ischemic and infarction patterns",
            "Apply advanced interpretation techniques"
          ],
          duration: 240,
          difficulty: "Advanced",
          prerequisites: "Arrhythmia Recognition completion required",
          slides: [
            {
              name: "Electrical Axis",
              content: "Learn to determine and interpret electrical axis.",
              description: "Understanding cardiac electrical axis and its clinical significance"
            },
            {
              name: "Chamber Enlargement",
              content: "Identify patterns of atrial and ventricular enlargement.",
              description: "Recognizing structural heart disease on ECG"
            },
            {
              name: "Ischemic Patterns",
              content: "Recognize acute and chronic ischemic changes.",
              description: "ECG signs of myocardial ischemia and infarction"
            },
            {
              name: "Complex Cases",
              content: "Apply all knowledge to complex clinical scenarios.",
              description: "Putting it all together in real-world cases"
            }
          ]
        }
      ];

      return NextResponse.json({
        success: true,
        modules: sampleModules,
        count: sampleModules.length
      });
    }
  } catch (error) {
    console.error('Error loading ECG modules:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load ECG modules',
        modules: [],
        count: 0
      },
      { status: 500 }
    );
  }
}

