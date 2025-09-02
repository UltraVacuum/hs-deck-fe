

import { NextRequest } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  // Check for cron secret (optional but recommended for security)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Execute the updates crawl script
    const { stdout, stderr } = await execAsync('cd scripts && node -r dotenv/config crawl-updates.js');
    
    return Response.json({ 
      success: true, 
      message: 'Updates crawl completed',
      output: stdout,
      error: stderr
    });
  } catch (error) {
    console.error('Cron job error:', error);
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : String(error);
    return Response.json({ error: 'Cron job failed', details: errorMessage }, { status: 500 });
  }
}

