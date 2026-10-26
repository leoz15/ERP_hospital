import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      where: { active: true },
      include: {
        warehouses: true,
      },
      orderBy: { code: 'asc' },
    });
    return NextResponse.json(departments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
