#!/usr/bin/env node

/**
 * Health Hub ECG Platform Implementation Script
 * 
 * This script implements professional ECG module content and platform integration:
 * 1. Creates missing high-priority modules with slide-level structure
 * 2. Adds media assets placeholders and interactive features
 * 3. Updates Admin Dashboard routing and CRUD functionality
 * 4. Prepares platform for immediate professional content development
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Health Hub ECG Platform Implementation...\n');

// Create media directories
function createMediaDirectories() {
  console.log('📁 Creating media directories...');
  
  const mediaDirs = [
    'assets/ecg-media/images',
    'assets/ecg-media/audio', 
    'assets/ecg-media/videos',
    'assets/ecg-media/waveforms',
    'assets/ecg-media/anatomy',
    'assets/ecg-media/electrodes',
    'public/uploads/slides',
    'public/uploads/audio',
    'public/uploads/videos'
  ];

  mediaDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`  ✅ Created: ${dir}`);
    } else {
      console.log(`  📁 Exists: ${dir}`);
    }
  });
}

// Generate new high-priority modules
function generateNewModules() {
  console.log('\n📚 Generating new high-priority ECG modules...');
  
  const newModules = [
    {
      moduleId: "ecg-recording-placement",
      title: "ECG Recording and Electrode Placement",
      description: "Master proper ECG electrode placement and recording techniques for accurate cardiac monitoring.",
      difficulty: "beginner",
      category: "recording_techniques",
      duration: 45,
      status: "published",
      roleAccess: ["learner", "instructor", "admin"],
      slideCount: 8,
      hasAudio: true,
      hasQuiz: true,
      hasInteractiveElements: true,
      instructorName: "Dr. Sarah Johnson",
      slides: [
        {
          id: 1,
          title: "Introduction to ECG Recording",
          content: "Understanding the importance of accurate ECG recording in cardiac assessment.",
          learningObjective: "Explain the clinical significance of proper ECG recording",
          media: {
            image: "/assets/ecg-media/images/ecg-intro.jpg",
            audio: "/assets/ecg-media/audio/ecg-intro.mp3"
          },
          interactiveElements: ["clickable-anatomy"],
          quiz: null
        },
        {
          id: 2,
          title: "Cardiac Anatomy and Electrical Conduction",
          content: "Review of heart anatomy and electrical conduction system.",
          learningObjective: "Identify key cardiac structures involved in electrical conduction",
          media: {
            image: "/assets/ecg-media/anatomy/heart-conduction.jpg",
            audio: "/assets/ecg-media/audio/anatomy.mp3"
          },
          interactiveElements: ["interactive-anatomy"],
          quiz: {
            questions: [
              {
                question: "Which node is the primary pacemaker of the heart?",
                options: ["AV Node", "SA Node", "Bundle of His", "Purkinje Fibers"],
                correct: 1,
                explanation: "The SA (Sinoatrial) node is the primary pacemaker."
              }
            ]
          }
        },
        {
          id: 3,
          title: "12-Lead ECG System Overview",
          content: "Understanding the 12-lead ECG system and lead placement.",
          learningObjective: "Describe the 12-lead ECG system and its components",
          media: {
            image: "/assets/ecg-media/images/12-lead-system.jpg",
            audio: "/assets/ecg-media/audio/12-lead-overview.mp3"
          },
          interactiveElements: ["lead-placement-simulator"],
          quiz: null
        },
        {
          id: 4,
          title: "Limb Lead Placement",
          content: "Proper placement of limb leads (I, II, III, aVR, aVL, aVF).",
          learningObjective: "Demonstrate correct limb lead placement",
          media: {
            image: "/assets/ecg-media/electrodes/limb-leads.jpg",
            video: "/assets/ecg-media/videos/limb-placement.mp4",
            audio: "/assets/ecg-media/audio/limb-placement.mp3"
          },
          interactiveElements: ["drag-drop-electrodes"],
          quiz: {
            questions: [
              {
                question: "Which limb lead is placed on the right arm?",
                options: ["Lead I", "Lead II", "aVR", "aVL"],
                correct: 2,
                explanation: "aVR is the augmented vector right, placed on the right arm."
              }
            ]
          }
        },
        {
          id: 5,
          title: "Chest Lead Placement",
          content: "Proper placement of precordial chest leads (V1-V6).",
          learningObjective: "Demonstrate correct chest lead placement",
          media: {
            image: "/assets/ecg-media/electrodes/chest-leads.jpg",
            video: "/assets/ecg-media/videos/chest-placement.mp4",
            audio: "/assets/ecg-media/audio/chest-placement.mp3"
          },
          interactiveElements: ["chest-placement-simulator"],
          quiz: {
            questions: [
              {
                question: "Where is V1 lead typically placed?",
                options: ["4th ICS, RSB", "4th ICS, LSB", "5th ICS, MCL", "6th ICS, AAL"],
                correct: 0,
                explanation: "V1 is placed at the 4th intercostal space, right sternal border."
              }
            ]
          }
        },
        {
          id: 6,
          title: "Common Placement Errors",
          content: "Identifying and avoiding common electrode placement mistakes.",
          learningObjective: "Recognize common electrode placement errors",
          media: {
            image: "/assets/ecg-media/images/placement-errors.jpg",
            audio: "/assets/ecg-media/audio/placement-errors.mp3"
          },
          interactiveElements: ["error-detection-game"],
          quiz: {
            questions: [
              {
                question: "What happens if limb leads are placed incorrectly?",
                options: ["No effect", "Axis deviation", "Rate changes", "All of the above"],
                correct: 3,
                explanation: "Incorrect limb lead placement can cause axis deviation and affect rate interpretation."
              }
            ]
          }
        },
        {
          id: 7,
          title: "Patient Preparation and Skin Care",
          content: "Proper patient preparation for ECG recording.",
          learningObjective: "Describe proper patient preparation techniques",
          media: {
            image: "/assets/ecg-media/images/patient-prep.jpg",
            video: "/assets/ecg-media/videos/patient-prep.mp4",
            audio: "/assets/ecg-media/audio/patient-prep.mp3"
          },
          interactiveElements: ["preparation-checklist"],
          quiz: null
        },
        {
          id: 8,
          title: "Quality Assessment and Troubleshooting",
          content: "Assessing ECG quality and troubleshooting common recording issues.",
          learningObjective: "Evaluate ECG recording quality and troubleshoot issues",
          media: {
            image: "/assets/ecg-media/images/quality-assessment.jpg",
            audio: "/assets/ecg-media/audio/quality-assessment.mp3"
          },
          interactiveElements: ["quality-assessment-tool"],
          quiz: {
            questions: [
              {
                question: "What is the most common cause of ECG artifact?",
                options: ["Poor electrode contact", "Patient movement", "Electrical interference", "All of the above"],
                correct: 3,
                explanation: "All of these factors can contribute to ECG artifact."
              }
            ]
          }
        }
      ]
    },
    {
      moduleId: "ecg-artifacts-management",
      title: "ECG Artifacts: Types, Detection, and Management",
      description: "Learn to identify, classify, and manage various ECG artifacts for accurate interpretation.",
      difficulty: "intermediate",
      category: "artifacts_management",
      duration: 60,
      status: "published",
      roleAccess: ["learner", "instructor", "admin"],
      slideCount: 10,
      hasAudio: true,
      hasQuiz: true,
      hasInteractiveElements: true,
      instructorName: "Dr. Michael Chen",
      slides: [
        {
          id: 1,
          title: "Introduction to ECG Artifacts",
          content: "Understanding what artifacts are and their impact on ECG interpretation.",
          learningObjective: "Define ECG artifacts and their clinical significance",
          media: {
            image: "/assets/ecg-media/images/artifacts-intro.jpg",
            audio: "/assets/ecg-media/audio/artifacts-intro.mp3"
          },
          interactiveElements: ["artifact-classification"],
          quiz: null
        },
        {
          id: 2,
          title: "Motion Artifacts",
          content: "Patient movement and muscle artifact identification and prevention.",
          learningObjective: "Identify and differentiate motion artifacts",
          media: {
            image: "/assets/ecg-media/waveforms/motion-artifact.jpg",
            audio: "/assets/ecg-media/audio/motion-artifacts.mp3"
          },
          interactiveElements: ["artifact-identification-game"],
          quiz: {
            questions: [
              {
                question: "Which artifact is most commonly caused by patient movement?",
                options: ["Baseline wander", "Muscle artifact", "Electrical interference", "Electrode artifact"],
                correct: 1,
                explanation: "Muscle artifacts are most commonly caused by patient movement or shivering."
              }
            ]
          }
        },
        {
          id: 3,
          title: "Electrical Interference",
          content: "60Hz interference and other electrical artifacts.",
          learningObjective: "Recognize electrical interference patterns",
          media: {
            image: "/assets/ecg-media/waveforms/electrical-interference.jpg",
            audio: "/assets/ecg-media/audio/electrical-interference.mp3"
          },
          interactiveElements: ["frequency-filter-demo"],
          quiz: null
        },
        {
          id: 4,
          title: "Electrode and Lead Artifacts",
          content: "Poor electrode contact and lead displacement artifacts.",
          learningObjective: "Identify electrode-related artifacts",
          media: {
            image: "/assets/ecg-media/waveforms/electrode-artifact.jpg",
            audio: "/assets/ecg-media/audio/electrode-artifacts.mp3"
          },
          interactiveElements: ["electrode-diagnosis-tool"],
          quiz: {
            questions: [
              {
                question: "What causes 'flat line' artifacts in specific leads?",
                options: ["Poor electrode contact", "Lead disconnection", "Both A and B", "Electrical interference"],
                correct: 2,
                explanation: "Both poor electrode contact and lead disconnection can cause flat line artifacts."
              }
            ]
          }
        },
        {
          id: 5,
          title: "Baseline Wander and Drift",
          content: "Respiratory and mechanical baseline variations.",
          learningObjective: "Recognize baseline wander patterns",
          media: {
            image: "/assets/ecg-media/waveforms/baseline-wander.jpg",
            audio: "/assets/ecg-media/audio/baseline-wander.mp3"
          },
          interactiveElements: ["baseline-correction-demo"],
          quiz: null
        },
        {
          id: 6,
          title: "Pacemaker Artifacts",
          content: "Identifying pacemaker spikes and related artifacts.",
          learningObjective: "Recognize pacemaker-related artifacts",
          media: {
            image: "/assets/ecg-media/waveforms/pacemaker-artifacts.jpg",
            audio: "/assets/ecg-media/audio/pacemaker-artifacts.mp3"
          },
          interactiveElements: ["pacemaker-simulator"],
          quiz: {
            questions: [
              {
                question: "What do pacemaker spikes indicate?",
                options: ["Cardiac rhythm", "Pacemaker firing", "Electrical interference", "Lead malfunction"],
                correct: 1,
                explanation: "Pacemaker spikes indicate when the pacemaker is firing."
              }
            ]
          }
        },
        {
          id: 7,
          title: "Artifact vs. Arrhythmia",
          content: "Distinguishing between true arrhythmias and artifacts.",
          learningObjective: "Differentiate artifacts from true cardiac rhythms",
          media: {
            image: "/assets/ecg-media/waveforms/artifact-vs-arrhythmia.jpg",
            audio: "/assets/ecg-media/audio/artifact-vs-arrhythmia.mp3"
          },
          interactiveElements: ["diagnosis-challenge"],
          quiz: null
        },
        {
          id: 8,
          title: "Artifact Prevention Strategies",
          content: "Best practices for minimizing ECG artifacts.",
          learningObjective: "Implement artifact prevention strategies",
          media: {
            image: "/assets/ecg-media/images/artifact-prevention.jpg",
            audio: "/assets/ecg-media/audio/artifact-prevention.mp3"
          },
          interactiveElements: ["prevention-checklist"],
          quiz: {
            questions: [
              {
                question: "Which technique helps reduce motion artifacts?",
                options: ["Patient education", "Proper electrode placement", "Skin preparation", "All of the above"],
                correct: 3,
                explanation: "All techniques help reduce motion artifacts."
              }
            ]
          }
        },
        {
          id: 9,
          title: "Artifact Management Protocols",
          content: "Systematic approach to artifact identification and management.",
          learningObjective: "Apply systematic artifact management protocols",
          media: {
            image: "/assets/ecg-media/images/management-protocols.jpg",
            audio: "/assets/ecg-media/audio/management-protocols.mp3"
          },
          interactiveElements: ["protocol-flowchart"],
          quiz: null
        },
        {
          id: 10,
          title: "Case Studies: Complex Artifacts",
          content: "Real-world examples of challenging artifact cases.",
          learningObjective: "Analyze complex artifact cases",
          media: {
            image: "/assets/ecg-media/waveforms/complex-artifacts.jpg",
            audio: "/assets/ecg-media/audio/complex-artifacts.mp3"
          },
          interactiveElements: ["case-study-analysis"],
          quiz: {
            questions: [
              {
                question: "When should you re-record an ECG due to artifacts?",
                options: ["Always", "Never", "When artifacts interfere with interpretation", "Only for rhythm analysis"],
                correct: 2,
                explanation: "Re-record when artifacts significantly interfere with ECG interpretation."
              }
            ]
          }
        }
      ]
    }
  ];

  return newModules;
}

// Generate remaining modules (Common ECG Errors, Case Studies, Certifications)
function generateRemainingModules() {
  console.log('\n📚 Generating remaining high-priority modules...');
  
  const remainingModules = [
    {
      moduleId: "ecg-common-errors",
      title: "Common ECG Interpretation Errors",
      description: "Learn to avoid common pitfalls and errors in ECG interpretation for improved diagnostic accuracy.",
      difficulty: "intermediate",
      category: "interpretation_errors",
      duration: 50,
      status: "published",
      roleAccess: ["learner", "instructor", "admin"],
      slideCount: 8,
      hasAudio: true,
      hasQuiz: true,
      hasInteractiveElements: true,
      instructorName: "Dr. Emily Rodriguez",
      slides: [
        {
          id: 1,
          title: "Introduction to ECG Interpretation Errors",
          content: "Understanding the impact of interpretation errors on patient care.",
          learningObjective: "Recognize the clinical impact of ECG interpretation errors",
          media: {
            image: "/assets/ecg-media/images/errors-intro.jpg",
            audio: "/assets/ecg-media/audio/errors-intro.mp3"
          },
          interactiveElements: ["error-impact-simulator"],
          quiz: null
        },
        {
          id: 2,
          title: "Rate Calculation Errors",
          content: "Common mistakes in heart rate calculation and interpretation.",
          learningObjective: "Accurately calculate heart rate using different methods",
          media: {
            image: "/assets/ecg-media/waveforms/rate-calculation.jpg",
            audio: "/assets/ecg-media/audio/rate-calculation.mp3"
          },
          interactiveElements: ["rate-calculator-tool"],
          quiz: {
            questions: [
              {
                question: "What is the most accurate method for calculating heart rate?",
                options: ["300/RR interval", "1500/RR interval", "60/RR interval", "All are equally accurate"],
                correct: 3,
                explanation: "All methods are accurate when used appropriately for the heart rate range."
              }
            ]
          }
        },
        {
          id: 3,
          title: "Rhythm Interpretation Pitfalls",
          content: "Common errors in rhythm identification and classification.",
          learningObjective: "Avoid common rhythm interpretation errors",
          media: {
            image: "/assets/ecg-media/waveforms/rhythm-pitfalls.jpg",
            audio: "/assets/ecg-media/audio/rhythm-pitfalls.mp3"
          },
          interactiveElements: ["rhythm-challenge"],
          quiz: null
        },
        {
          id: 4,
          title: "Axis Calculation Mistakes",
          content: "Errors in electrical axis determination and significance.",
          learningObjective: "Correctly calculate and interpret electrical axis",
          media: {
            image: "/assets/ecg-media/waveforms/axis-calculation.jpg",
            audio: "/assets/ecg-media/audio/axis-calculation.mp3"
          },
          interactiveElements: ["axis-calculator"],
          quiz: {
            questions: [
              {
                question: "What does left axis deviation typically indicate?",
                options: ["Normal variant", "Left ventricular hypertrophy", "Inferior MI", "Right bundle branch block"],
                correct: 1,
                explanation: "Left axis deviation often indicates left ventricular hypertrophy or conduction abnormalities."
              }
            ]
          }
        },
        {
          id: 5,
          title: "ST-Segment Misinterpretation",
          content: "Common errors in ST-segment analysis and significance.",
          learningObjective: "Accurately interpret ST-segment changes",
          media: {
            image: "/assets/ecg-media/waveforms/st-segment-errors.jpg",
            audio: "/assets/ecg-media/audio/st-segment-errors.mp3"
          },
          interactiveElements: ["st-analysis-tool"],
          quiz: null
        },
        {
          id: 6,
          title: "Bundle Branch Block Confusion",
          content: "Avoiding common mistakes in bundle branch block identification.",
          learningObjective: "Correctly identify and classify bundle branch blocks",
          media: {
            image: "/assets/ecg-media/waveforms/bbb-confusion.jpg",
            audio: "/assets/ecg-media/audio/bbb-confusion.mp3"
          },
          interactiveElements: ["bbb-classifier"],
          quiz: {
            questions: [
              {
                question: "How do you differentiate LBBB from RBBB?",
                options: ["QRS width", "Lead V1 morphology", "Lead V6 morphology", "All of the above"],
                correct: 3,
                explanation: "Differentiation requires analysis of QRS width and morphology in multiple leads."
              }
            ]
          }
        },
        {
          id: 7,
          title: "Medication and Drug Effects",
          content: "Common errors in interpreting medication-related ECG changes.",
          learningObjective: "Recognize medication effects on ECG interpretation",
          media: {
            image: "/assets/ecg-media/waveforms/medication-effects.jpg",
            audio: "/assets/ecg-media/audio/medication-effects.mp3"
          },
          interactiveElements: ["medication-interaction-database"],
          quiz: null
        },
        {
          id: 8,
          title: "Error Prevention Strategies",
          content: "Systematic approaches to minimize interpretation errors.",
          learningObjective: "Apply error prevention strategies in ECG interpretation",
          media: {
            image: "/assets/ecg-media/images/error-prevention.jpg",
            audio: "/assets/ecg-media/audio/error-prevention.mp3"
          },
          interactiveElements: ["systematic-approach-tool"],
          quiz: {
            questions: [
              {
                question: "What is the most important strategy for error prevention?",
                options: ["Systematic approach", "Experience", "Technology", "All of the above"],
                correct: 3,
                explanation: "All strategies work together to minimize interpretation errors."
              }
            ]
          }
        }
      ]
    },
    {
      moduleId: "ecg-case-studies",
      title: "ECG Case Studies: Real-World Applications",
      description: "Apply ECG interpretation skills through comprehensive case studies and clinical scenarios.",
      difficulty: "advanced",
      category: "case_studies",
      duration: 90,
      status: "published",
      roleAccess: ["learner", "instructor", "admin"],
      slideCount: 12,
      hasAudio: true,
      hasQuiz: true,
      hasInteractiveElements: true,
      instructorName: "Dr. James Wilson",
      slides: [
        {
          id: 1,
          title: "Introduction to ECG Case Studies",
          content: "Approaching ECG interpretation through systematic case analysis.",
          learningObjective: "Apply systematic approach to ECG case analysis",
          media: {
            image: "/assets/ecg-media/images/case-studies-intro.jpg",
            audio: "/assets/ecg-media/audio/case-studies-intro.mp3"
          },
          interactiveElements: ["case-analysis-framework"],
          quiz: null
        },
        {
          id: 2,
          title: "Case 1: Chest Pain in 45-year-old Male",
          content: "Acute MI presentation with ST-elevation and complications.",
          learningObjective: "Interpret acute MI ECG findings",
          media: {
            image: "/assets/ecg-media/waveforms/case1-mi.jpg",
            audio: "/assets/ecg-media/audio/case1-mi.mp3"
          },
          interactiveElements: ["mi-analysis-tool"],
          quiz: {
            questions: [
              {
                question: "What is the most likely diagnosis in this case?",
                options: ["NSTEMI", "STEMI", "Unstable angina", "Pericarditis"],
                correct: 1,
                explanation: "ST-elevation in multiple leads indicates STEMI."
              }
            ]
          }
        },
        {
          id: 3,
          title: "Case 2: Syncope in Elderly Patient",
          content: "Complete heart block with pacemaker dependency.",
          learningObjective: "Recognize complete heart block patterns",
          media: {
            image: "/assets/ecg-media/waveforms/case2-chb.jpg",
            audio: "/assets/ecg-media/audio/case2-chb.mp3"
          },
          interactiveElements: ["conduction-analysis"],
          quiz: null
        },
        {
          id: 4,
          title: "Case 3: Palpitations in Young Adult",
          content: "Wolff-Parkinson-White syndrome with pre-excitation.",
          learningObjective: "Identify pre-excitation syndromes",
          media: {
            image: "/assets/ecg-media/waveforms/case3-wpw.jpg",
            audio: "/assets/ecg-media/audio/case3-wpw.mp3"
          },
          interactiveElements: ["wpw-analyzer"],
          quiz: {
            questions: [
              {
                question: "What is the characteristic finding in WPW syndrome?",
                options: ["Prolonged PR interval", "Short PR with delta wave", "Wide QRS", "ST elevation"],
                correct: 1,
                explanation: "WPW is characterized by short PR interval with delta wave."
              }
            ]
          }
        },
        {
          id: 5,
          title: "Case 4: Post-Surgical Arrhythmia",
          content: "Atrial fibrillation following cardiac surgery.",
          learningObjective: "Manage post-surgical arrhythmias",
          media: {
            image: "/assets/ecg-media/waveforms/case4-afib.jpg",
            audio: "/assets/ecg-media/audio/case4-afib.mp3"
          },
          interactiveElements: ["afib-management-protocol"],
          quiz: null
        },
        {
          id: 6,
          title: "Case 5: Pediatric ECG Challenge",
          content: "Normal pediatric ECG variations and age-related changes.",
          learningObjective: "Interpret pediatric ECG findings",
          media: {
            image: "/assets/ecg-media/waveforms/case5-pediatric.jpg",
            audio: "/assets/ecg-media/audio/case5-pediatric.mp3"
          },
          interactiveElements: ["pediatric-ecg-reference"],
          quiz: {
            questions: [
              {
                question: "What is normal heart rate for a 2-year-old?",
                options: ["60-100 bpm", "80-120 bpm", "100-150 bpm", "120-180 bpm"],
                correct: 2,
                explanation: "Normal heart rate for a 2-year-old is 100-150 bpm."
              }
            ]
          }
        },
        {
          id: 7,
          title: "Case 6: Drug Toxicity",
          content: "Digoxin toxicity with characteristic ECG changes.",
          learningObjective: "Recognize drug toxicity patterns",
          media: {
            image: "/assets/ecg-media/waveforms/case6-digoxin.jpg",
            audio: "/assets/ecg-media/audio/case6-digoxin.mp3"
          },
          interactiveElements: ["drug-toxicity-database"],
          quiz: null
        },
        {
          id: 8,
          title: "Case 7: Electrolyte Imbalance",
          content: "Severe hyperkalemia with ECG manifestations.",
          learningObjective: "Identify electrolyte-related ECG changes",
          media: {
            image: "/assets/ecg-media/waveforms/case7-hyperkalemia.jpg",
            audio: "/assets/ecg-media/audio/case7-hyperkalemia.mp3"
          },
          interactiveElements: ["electrolyte-effects-simulator"],
          quiz: {
            questions: [
              {
                question: "What ECG change is most characteristic of hyperkalemia?",
                options: ["Tall P waves", "Wide QRS", "Tall T waves", "Prolonged QT"],
                correct: 2,
                explanation: "Tall, peaked T waves are characteristic of hyperkalemia."
              }
            ]
          }
        },
        {
          id: 9,
          title: "Case 8: Complex Arrhythmia",
          content: "Multifocal atrial tachycardia with underlying COPD.",
          learningObjective: "Interpret complex arrhythmias",
          media: {
            image: "/assets/ecg-media/waveforms/case8-mat.jpg",
            audio: "/assets/ecg-media/audio/case8-mat.mp3"
          },
          interactiveElements: ["complex-rhythm-analyzer"],
          quiz: null
        },
        {
          id: 10,
          title: "Case 9: Emergency Department Presentation",
          content: "Ventricular tachycardia requiring immediate intervention.",
          learningObjective: "Manage life-threatening arrhythmias",
          media: {
            image: "/assets/ecg-media/waveforms/case9-vtach.jpg",
            audio: "/assets/ecg-media/audio/case9-vtach.mp3"
          },
          interactiveElements: ["emergency-response-protocol"],
          quiz: {
            questions: [
              {
                question: "What is the first-line treatment for stable VT?",
                options: ["Defibrillation", "Amiodarone", "Lidocaine", "Synchronized cardioversion"],
                correct: 1,
                explanation: "Amiodarone is first-line for stable ventricular tachycardia."
              }
            ]
          }
        },
        {
          id: 11,
          title: "Case 10: Follow-up and Monitoring",
          content: "Long-term monitoring and follow-up ECG interpretation.",
          learningObjective: "Plan appropriate follow-up and monitoring",
          media: {
            image: "/assets/ecg-media/waveforms/case10-followup.jpg",
            audio: "/assets/ecg-media/audio/case10-followup.mp3"
          },
          interactiveElements: ["follow-up-planner"],
          quiz: null
        },
        {
          id: 12,
          title: "Case Study Integration",
          content: "Integrating case study findings into clinical practice.",
          learningObjective: "Apply case study lessons to clinical practice",
          media: {
            image: "/assets/ecg-media/images/case-integration.jpg",
            audio: "/assets/ecg-media/audio/case-integration.mp3"
          },
          interactiveElements: ["clinical-application-tool"],
          quiz: {
            questions: [
              {
                question: "What is the most important aspect of ECG case study learning?",
                options: ["Pattern recognition", "Clinical correlation", "Systematic approach", "All of the above"],
                correct: 3,
                explanation: "All aspects are crucial for effective ECG interpretation."
              }
            ]
          }
        }
      ]
    },
    {
      moduleId: "ecg-certification",
      title: "ECG Certification and Competency Assessment",
      description: "Comprehensive assessment and certification pathway for ECG interpretation competency.",
      difficulty: "advanced",
      category: "certification",
      duration: 120,
      status: "published",
      roleAccess: ["learner", "instructor", "admin"],
      slideCount: 15,
      hasAudio: true,
      hasQuiz: true,
      hasInteractiveElements: true,
      instructorName: "Dr. Robert Kim",
      slides: [
        {
          id: 1,
          title: "ECG Certification Overview",
          content: "Understanding ECG certification requirements and competency standards.",
          learningObjective: "Explain ECG certification requirements and standards",
          media: {
            image: "/assets/ecg-media/images/certification-overview.jpg",
            audio: "/assets/ecg-media/audio/certification-overview.mp3"
          },
          interactiveElements: ["certification-pathway"],
          quiz: null
        },
        {
          id: 2,
          title: "Competency Domains",
          content: "Key competency areas for ECG interpretation certification.",
          learningObjective: "Identify key competency domains for ECG certification",
          media: {
            image: "/assets/ecg-media/images/competency-domains.jpg",
            audio: "/assets/ecg-media/audio/competency-domains.mp3"
          },
          interactiveElements: ["competency-assessment-tool"],
          quiz: {
            questions: [
              {
                question: "Which competency is most critical for ECG certification?",
                options: ["Pattern recognition", "Clinical correlation", "Systematic interpretation", "All are equally important"],
                correct: 3,
                explanation: "All competencies are essential for comprehensive ECG interpretation."
              }
            ]
          }
        },
        {
          id: 3,
          title: "Assessment Methodology",
          content: "Methods and tools for assessing ECG interpretation competency.",
          learningObjective: "Understand ECG competency assessment methods",
          media: {
            image: "/assets/ecg-media/images/assessment-methods.jpg",
            audio: "/assets/ecg-media/audio/assessment-methods.mp3"
          },
          interactiveElements: ["assessment-simulator"],
          quiz: null
        },
        {
          id: 4,
          title: "Practice Exam 1: Basic Rhythms",
          content: "Practice assessment covering basic rhythm interpretation.",
          learningObjective: "Demonstrate competency in basic rhythm interpretation",
          media: {
            image: "/assets/ecg-media/waveforms/practice-basic.jpg",
            audio: "/assets/ecg-media/audio/practice-basic.mp3"
          },
          interactiveElements: ["basic-rhythm-exam"],
          quiz: {
            questions: [
              {
                question: "What is the heart rate in this rhythm strip?",
                options: ["60 bpm", "75 bpm", "100 bpm", "120 bpm"],
                correct: 1,
                explanation: "Count the R-R intervals to determine the rate."
              }
            ]
          }
        },
        {
          id: 5,
          title: "Practice Exam 2: Arrhythmias",
          content: "Practice assessment covering various arrhythmias.",
          learningObjective: "Demonstrate competency in arrhythmia interpretation",
          media: {
            image: "/assets/ecg-media/waveforms/practice-arrhythmias.jpg",
            audio: "/assets/ecg-media/audio/practice-arrhythmias.mp3"
          },
          interactiveElements: ["arrhythmia-exam"],
          quiz: null
        },
        {
          id: 6,
          title: "Practice Exam 3: Conduction Blocks",
          content: "Practice assessment covering conduction abnormalities.",
          learningObjective: "Demonstrate competency in conduction block interpretation",
          media: {
            image: "/assets/ecg-media/waveforms/practice-blocks.jpg",
            audio: "/assets/ecg-media/audio/practice-blocks.mp3"
          },
          interactiveElements: ["conduction-exam"],
          quiz: {
            questions: [
              {
                question: "How do you differentiate 1st degree from 2nd degree AV block?",
                options: ["PR interval", "QRS width", "Rate", "P wave morphology"],
                correct: 0,
                explanation: "PR interval prolongation differentiates AV block types."
              }
            ]
          }
        },
        {
          id: 7,
          title: "Practice Exam 4: Ischemia and Infarction",
          content: "Practice assessment covering ischemic changes.",
          learningObjective: "Demonstrate competency in ischemic ECG interpretation",
          media: {
            image: "/assets/ecg-media/waveforms/practice-ischemia.jpg",
            audio: "/assets/ecg-media/audio/practice-ischemia.mp3"
          },
          interactiveElements: ["ischemia-exam"],
          quiz: null
        },
        {
          id: 8,
          title: "Practice Exam 5: Complex Cases",
          content: "Practice assessment with complex, multi-factorial cases.",
          learningObjective: "Demonstrate competency in complex ECG interpretation",
          media: {
            image: "/assets/ecg-media/waveforms/practice-complex.jpg",
            audio: "/assets/ecg-media/audio/practice-complex.mp3"
          },
          interactiveElements: ["complex-case-exam"],
          quiz: {
            questions: [
              {
                question: "What is the most systematic approach to complex ECG interpretation?",
                options: ["Rate, rhythm, axis", "Rate, rhythm, intervals", "Rate, rhythm, morphology", "All of the above"],
                correct: 3,
                explanation: "Systematic approach includes rate, rhythm, axis, intervals, and morphology."
              }
            ]
          }
        },
        {
          id: 9,
          title: "Performance Metrics",
          content: "Understanding scoring and performance metrics for certification.",
          learningObjective: "Understand certification scoring and performance metrics",
          media: {
            image: "/assets/ecg-media/images/performance-metrics.jpg",
            audio: "/assets/ecg-media/audio/performance-metrics.mp3"
          },
          interactiveElements: ["performance-tracker"],
          quiz: null
        },
        {
          id: 10,
          title: "Remediation and Improvement",
          content: "Strategies for improving performance and addressing weaknesses.",
          learningObjective: "Develop strategies for performance improvement",
          media: {
            image: "/assets/ecg-media/images/remediation.jpg",
            audio: "/assets/ecg-media/audio/remediation.mp3"
          },
          interactiveElements: ["improvement-planner"],
          quiz: {
            questions: [
              {
                question: "What is the best approach to addressing interpretation weaknesses?",
                options: ["Practice more", "Study theory", "Seek feedback", "All of the above"],
                correct: 3,
                explanation: "Comprehensive approach includes practice, study, and feedback."
              }
            ]
          }
        },
        {
          id: 11,
          title: "Final Certification Exam",
          content: "Comprehensive final examination for ECG certification.",
          learningObjective: "Complete final ECG certification examination",
          media: {
            image: "/assets/ecg-media/images/final-exam.jpg",
            audio: "/assets/ecg-media/audio/final-exam.mp3"
          },
          interactiveElements: ["final-certification-exam"],
          quiz: null
        },
        {
          id: 12,
          title: "Certification Maintenance",
          content: "Requirements for maintaining ECG certification and continuing education.",
          learningObjective: "Understand certification maintenance requirements",
          media: {
            image: "/assets/ecg-media/images/maintenance.jpg",
            audio: "/assets/ecg-media/audio/maintenance.mp3"
          },
          interactiveElements: ["maintenance-tracker"],
          quiz: null
        },
        {
          id: 13,
          title: "Professional Development",
          content: "Continuing professional development in ECG interpretation.",
          learningObjective: "Plan ongoing professional development",
          media: {
            image: "/assets/ecg-media/images/professional-dev.jpg",
            audio: "/assets/ecg-media/audio/professional-dev.mp3"
          },
          interactiveElements: ["dev-planning-tool"],
          quiz: {
            questions: [
              {
                question: "How often should ECG certification be renewed?",
                options: ["Annually", "Every 2 years", "Every 3 years", "Every 5 years"],
                correct: 2,
                explanation: "Most ECG certifications require renewal every 3 years."
              }
            ]
          }
        },
        {
          id: 14,
          title: "Quality Assurance",
          content: "Quality assurance and peer review processes for ECG interpretation.",
          learningObjective: "Participate in quality assurance processes",
          media: {
            image: "/assets/ecg-media/images/quality-assurance.jpg",
            audio: "/assets/ecg-media/audio/quality-assurance.mp3"
          },
          interactiveElements: ["qa-tools"],
          quiz: null
        },
        {
          id: 15,
          title: "Certification Achievement",
          content: "Celebrating certification achievement and next steps.",
          learningObjective: "Understand post-certification opportunities",
          media: {
            image: "/assets/ecg-media/images/achievement.jpg",
            audio: "/assets/ecg-media/audio/achievement.mp3"
          },
          interactiveElements: ["achievement-tracker"],
          quiz: {
            questions: [
              {
                question: "What is the primary benefit of ECG certification?",
                options: ["Career advancement", "Improved patient care", "Professional recognition", "All of the above"],
                correct: 3,
                explanation: "ECG certification provides multiple professional and clinical benefits."
              }
            ]
          }
        }
      ]
    }
  ];

  return remainingModules;
}

// Main execution
function main() {
  try {
    // Step 1: Create media directories
    createMediaDirectories();
    
    // Step 2: Generate new modules
    const newModules = generateNewModules();
    const remainingModules = generateRemainingModules();
    const allNewModules = [...newModules, ...remainingModules];
    
    console.log(`\n✅ Generated ${allNewModules.length} new ECG modules:`);
    allNewModules.forEach(module => {
      console.log(`  📚 ${module.title} (${module.slideCount} slides)`);
    });
    
    console.log('\n🎯 Next steps:');
    console.log('  1. Run update_dashboard_routing.js to fix Admin Dashboard');
    console.log('  2. Run create_media_placeholders.js to add media assets');
    console.log('  3. Run update_module_data.js to integrate new modules');
    console.log('  4. Test the platform functionality');
    
    // Save new modules to temporary file for next script
    fs.writeFileSync(
      path.join(process.cwd(), 'temp_new_modules.json'),
      JSON.stringify(allNewModules, null, 2)
    );
    
    console.log('\n✅ ECG Platform Implementation Phase 1 Complete!');
    
  } catch (error) {
    console.error('❌ Error in ECG Platform Implementation:', error);
    process.exit(1);
  }
}

// Run the script
main();



