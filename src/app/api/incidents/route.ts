import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resolvedParam = searchParams.get('resolved');
  let resolved: boolean | undefined = undefined;
  if (resolvedParam === 'true') resolved = true;
  if (resolvedParam === 'false') resolved = false;

  const incidents = await prisma.incident.findMany({
    where: resolved !== undefined ? { resolved } : {},
    orderBy: { tsStart: 'desc' },
    include: { camera: true },
  });
  return NextResponse.json(incidents);
}