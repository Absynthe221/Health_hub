import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { userId, moduleId } = params;
    
    // Read progress data from JSON file
    const progressDataPath = path.join(process.cwd(), 'data', 'ecg-progress.json');
    
    if (!fs.existsSync(progressDataPath)) {
      // Create empty progress data if it doesn't exist
      fs.writeFileSync(progressDataPath, JSON.stringify({}, null, 2));
    }
    
    const progressData = JSON.parse(fs.readFileSync(progressDataPath, 'utf8'));
    const userProgress = progressData[userId] || {};
    const moduleProgress = userProgress[moduleId] || {
      overallProgress: 0,
      sectionProgress: {},
      lastAccessed: new Date().toISOString(),
      completedAt: null,
      certificateGenerated: false
    };
    
    return NextResponse.json(moduleProgress);
  } catch (error) {
    console.error('Error loading progress data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { userId, moduleId } = params;
    const updates = await request.json();
    
    // Update progress data
    const progressDataPath = path.join(process.cwd(), 'data', 'ecg-progress.json');
    
    if (!fs.existsSync(progressDataPath)) {
      fs.writeFileSync(progressDataPath, JSON.stringify({}, null, 2));
    }
    
    const progressData = JSON.parse(fs.readFileSync(progressDataPath, 'utf8'));
    
    if (!progressData[userId]) {
      progressData[userId] = {};
    }
    
    if (!progressData[userId][moduleId]) {
      progressData[userId][moduleId] = {
        overallProgress: 0,
        slideProgress: {},
        segmentProgress: {},
        completedSlides: [],
        completedSegments: [],
        quizResults: {},
        lastAccessed: new Date().toISOString(),
        completedAt: null,
        certificateGenerated: false,
        totalSlides: 0,
        totalSegments: 0,
        totalQuestions: 0
      };
    }
    
    // Update slide progress
    if (updates.slideNumber !== undefined && updates.slideProgress !== undefined) {
      progressData[userId][moduleId].slideProgress[updates.slideNumber] = updates.slideProgress;
      
      // Mark slide as completed if progress is 100%
      if (updates.slideProgress >= 100) {
        if (!progressData[userId][moduleId].completedSlides.includes(updates.slideNumber)) {
          progressData[userId][moduleId].completedSlides.push(updates.slideNumber);
        }
      }
    }
    
    // Update segment progress
    if (updates.segmentId !== undefined && updates.segmentProgress !== undefined) {
      progressData[userId][moduleId].segmentProgress[updates.segmentId] = updates.segmentProgress;
      if (updates.segmentProgress >= 100) {
        if (!progressData[userId][moduleId].completedSegments.includes(updates.segmentId)) {
          progressData[userId][moduleId].completedSegments.push(updates.segmentId);
        }
      }
    }

    // Update quiz results
    if (updates.quizResults) {
      progressData[userId][moduleId].quizResults = {
        ...progressData[userId][moduleId].quizResults,
        ...updates.quizResults
      };
    }
    
    // Update overall progress
    if (updates.progress !== undefined) {
      progressData[userId][moduleId].overallProgress = updates.progress;
    }
    
    // Update module metadata
    if (updates.totalSlides !== undefined) {
      progressData[userId][moduleId].totalSlides = updates.totalSlides;
    }
    
    if (updates.totalQuestions !== undefined) {
      progressData[userId][moduleId].totalQuestions = updates.totalQuestions;
    }
    if (updates.totalSegments !== undefined) {
      progressData[userId][moduleId].totalSegments = updates.totalSegments;
    }
    
    // Calculate overall progress based on completed slides
    const totalSlides = progressData[userId][moduleId].totalSlides || 0;
    const completedSlides = progressData[userId][moduleId].completedSlides.length;
    const totalSegments = progressData[userId][moduleId].totalSegments || 0;
    const completedSegments = progressData[userId][moduleId].completedSegments.length;

    const unitsTotal = totalSlides + totalSegments;
    const unitsCompleted = completedSlides + completedSegments;
    if (unitsTotal > 0) {
      progressData[userId][moduleId].overallProgress = Math.round((unitsCompleted / unitsTotal) * 100);
    }
    
    progressData[userId][moduleId].lastAccessed = new Date().toISOString();
    
    // Mark as completed if overall progress is 80% or more
    if (progressData[userId][moduleId].overallProgress >= 80 && !progressData[userId][moduleId].completedAt) {
      progressData[userId][moduleId].completedAt = new Date().toISOString();
    }
    
    fs.writeFileSync(progressDataPath, JSON.stringify(progressData, null, 2));
    
    return NextResponse.json(progressData[userId][moduleId]);
  } catch (error) {
    console.error('Error updating progress data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



