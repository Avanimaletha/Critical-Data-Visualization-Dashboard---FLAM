import { NextResponse } from 'next/server';
import { DataGenerator } from '@/lib/dataGenerator';

const generator = new DataGenerator();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = parseInt(searchParams.get('count') || '10000');
  const startTime = parseInt(searchParams.get('startTime') || String(Date.now()));

  try {
    const data = generator.generateInitialDataset(count, startTime);
    return NextResponse.json({ data, count: data.length });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { count = 100, lastValue } = body;

    const data = generator.generateBatch(count, lastValue);
    return NextResponse.json({ data, count: data.length });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate data batch' },
      { status: 500 }
    );
  }
}
