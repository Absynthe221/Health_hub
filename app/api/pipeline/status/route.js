import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const pipelineDir = path.join(process.cwd(), 'scripts', 'pipeline');
    const status = {
      timestamp: new Date().toISOString(),
      pipeline: {
        status: 'unknown',
        lastRun: null,
        duration: 0,
        stages: {}
      },
      modules: {
        total: 0,
        processed: 0,
        pending: 0,
        errors: 0
      },
      ai: {
        services: {},
        totalRequests: 0,
        successRate: 0
      },
      system: {
        diskUsage: 0,
        memoryUsage: 0,
        uptime: process.uptime()
      }
    };

    // Check pipeline logs
    const logFiles = [
      'pipeline.log',
      'ai_integration.log',
      'ai_enhanced_pipeline.log'
    ];

    for (const logFile of logFiles) {
      const logPath = path.join(pipelineDir, logFile);
      if (fs.existsSync(logPath)) {
        const stats = fs.statSync(logPath);
        status.pipeline.lastRun = stats.mtime.toISOString();
        status.pipeline.status = 'available';
      }
    }

    // Check modules directory
    const modulesDir = path.join(process.cwd(), 'public', 'modules');
    if (fs.existsSync(modulesDir)) {
      const moduleDirs = fs.readdirSync(modulesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      status.modules.total = moduleDirs.length;
      status.modules.processed = moduleDirs.filter(moduleDir => {
        const modulePath = path.join(modulesDir, moduleDir, 'module.json');
        if (fs.existsSync(modulePath)) {
          try {
            const moduleData = JSON.parse(fs.readFileSync(modulePath, 'utf8'));
            return moduleData.aiEnhanced || false;
          } catch (error) {
            return false;
          }
        }
        return false;
      }).length;
    }

    // Check AI service availability
    const aiEndpoints = [
      'generateQuiz',
      'generateECGQuiz',
      'generateCaseStudy',
      'adaptiveQuiz',
      'validateQuiz',
      'quizMaster'
    ];

    for (const endpoint of aiEndpoints) {
      try {
        const response = await fetch(`http://localhost:3000/api/ai/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: true })
        });
        
        status.ai.services[endpoint] = {
          available: response.ok,
          status: response.status
        };
        
        if (response.ok) {
          status.ai.totalRequests++;
        }
      } catch (error) {
        status.ai.services[endpoint] = {
          available: false,
          error: error.message
        };
      }
    }

    status.ai.successRate = status.ai.totalRequests / aiEndpoints.length;

    // Check system resources (simplified)
    try {
      const diskUsage = await getDiskUsage();
      status.system.diskUsage = diskUsage;
    } catch (error) {
      status.system.diskUsage = 0;
    }

    return NextResponse.json({
      success: true,
      status
    });

  } catch (error) {
    console.error('Error getting pipeline status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get pipeline status',
      message: error.message
    });
  }
}

async function getDiskUsage() {
  try {
    const { execSync } = require('child_process');
    const result = execSync('df -h .', { encoding: 'utf8' });
    const lines = result.split('\n');
    const usageLine = lines[1]; // Second line contains usage info
    const parts = usageLine.split(/\s+/);
    return {
      total: parts[1],
      used: parts[2],
      available: parts[3],
      percentage: parts[4]
    };
  } catch (error) {
    return null;
  }
}

