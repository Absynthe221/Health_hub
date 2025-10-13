import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
  try {
    const { dryRun = false, skipAI = false, skipSegmentation = false } = await request.json();

    // Validate request
    if (typeof dryRun !== 'boolean' || typeof skipAI !== 'boolean' || typeof skipSegmentation !== 'boolean') {
      return NextResponse.json({
        success: false,
        error: 'Invalid parameters'
      }, { status: 400 });
    }

    // Check if pipeline is already running
    const isRunning = await checkPipelineRunning();
    if (isRunning) {
      return NextResponse.json({
        success: false,
        error: 'Pipeline is already running'
      }, { status: 409 });
    }

    // Build command arguments
    const args = ['scripts/complete_pipeline.js'];
    
    if (dryRun) args.push('--dry-run');
    if (skipAI) args.push('--skip-ai');
    if (skipSegmentation) args.push('--skip-segmentation');

    // Start pipeline process
    const pipelineProcess = spawn('node', args, {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false
    });

    // Store process reference (in a real app, you'd use Redis or similar)
    global.pipelineProcess = pipelineProcess;

    let output = '';
    let errorOutput = '';

    pipelineProcess.stdout.on('data', (data) => {
      output += data.toString();
      console.log(`Pipeline stdout: ${data}`);
    });

    pipelineProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error(`Pipeline stderr: ${data}`);
    });

    pipelineProcess.on('close', (code) => {
      console.log(`Pipeline process exited with code ${code}`);
      global.pipelineProcess = null;
    });

    pipelineProcess.on('error', (error) => {
      console.error(`Pipeline process error: ${error}`);
      global.pipelineProcess = null;
    });

    // Return immediate response
    return NextResponse.json({
      success: true,
      message: 'Pipeline started successfully',
      pid: pipelineProcess.pid,
      command: `node ${args.join(' ')}`,
      options: {
        dryRun,
        skipAI,
        skipSegmentation
      }
    });

  } catch (error) {
    console.error('Error starting pipeline:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to start pipeline',
      message: error.message
    }, { status: 500 });
  }
}

async function checkPipelineRunning() {
  // Check if there's already a pipeline process running
  return global.pipelineProcess !== null && global.pipelineProcess !== undefined;
}

export async function GET() {
  try {
    const isRunning = await checkPipelineRunning();
    
    return NextResponse.json({
      success: true,
      running: isRunning,
      pid: global.pipelineProcess?.pid || null
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to check pipeline status'
    }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    if (global.pipelineProcess) {
      global.pipelineProcess.kill('SIGTERM');
      global.pipelineProcess = null;
      
      return NextResponse.json({
        success: true,
        message: 'Pipeline stopped successfully'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'No pipeline process running'
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error stopping pipeline:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to stop pipeline',
      message: error.message
    }, { status: 500 });
  }
}

