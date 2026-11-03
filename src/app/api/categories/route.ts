import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.itemCategory.findMany({
      where: { active: true },
      include: {
        _count: { select: { items: true } },
      },
      orderBy: { code: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
