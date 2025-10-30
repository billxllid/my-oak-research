import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const queries = await prisma.query.findMany({
    include: {
      keywords: true,
      sources: true,
      _count: {
        select: {
          keywords: true,
          sources: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  // Manually map to include the counts directly on the query object
  const queriesWithCounts = queries.map(query => ({
    ...query,
    keywordsCount: query._count?.keywords || 0,
    sourcesCount: query._count?.sources || 0,
    // Remove _count to clean up the object if not needed elsewhere
    _count: undefined, // Or delete query._count;
  }));

  console.log("Queries with counts before sending:", queriesWithCounts);
  return NextResponse.json(queriesWithCounts);
}

export async function POST(req: Request) {
  const data = await req.json();
  const { name, description, frequency, enabled, keywordIds, sourceIds, rules } = data;

  // Validate keywordIds
  if (keywordIds && keywordIds.length > 0) {
    const existingKeywords = await prisma.keyword.count({
      where: { id: { in: keywordIds } },
    });
    if (existingKeywords !== keywordIds.length) {
      return NextResponse.json(
        { error: "One or more provided keywordIds do not exist." },
        { status: 400 }
      );
    }
  }

  // Validate sourceIds
  if (sourceIds && sourceIds.length > 0) {
    const existingSources = await prisma.source.count({
      where: { id: { in: sourceIds } },
    });
    if (existingSources !== sourceIds.length) {
      return NextResponse.json(
        { error: "One or more provided sourceIds do not exist." },
        { status: 400 }
      );
    }
  }

  const query = await prisma.query.create({
    data: {
      name,
      description,
      frequency,
      enabled,
      rules,
      keywords: {
        connect: keywordIds?.map((id: string) => ({ id })) || []
      },
      sources: {
        connect: sourceIds?.map((id: string) => ({ id })) || []
      },
    },
  });

  return NextResponse.json(query);
}