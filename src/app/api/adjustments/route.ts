import { logAudit } from '@/lib/audit';
import { generateDocumentNumber } from '@/lib/doc-sequence';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const adjustments = await prisma.stockAdjustment.findMany({
      include: {
        warehouse: true,
        lines: {
          include: { item: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(adjustments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const adjustmentNumber = await generateDocumentNumber('ADJ');

    const adj = await prisma.stockAdjustment.create({
      data: {
        adjustmentNumber,
        warehouseId: body.warehouseId,
        adjustmentType: body.adjustmentType || 'CORRECTION',
        status: 'PENDING_APPROVAL',
        reason: body.reason,
        requestedBy: body.userName || 'เจ้าหน้าที่คลัง',
        lines: {
          create: (body.lines || []).map((l: any) => ({
            itemId: l.itemId,
            lotNumber: l.lotNumber || null,
            currentQty: Number.parseFloat(l.currentQty || '0'),
            adjustmentQty: Number.parseFloat(l.adjustmentQty),
            newQty: Number.parseFloat(l.currentQty || '0') + Number.parseFloat(l.adjustmentQty),
            unitCost: Number.parseFloat(l.unitCost || '0'),
            reason: l.reason || body.reason,
          })),
        },
      },
      include: { lines: true },
    });

    await logAudit({
      userName: body.userName || 'เจ้าหน้าที่คลัง',
      action: 'CREATE',
      module: 'ADJUSTMENT',
      recordId: adj.id,
      details: `สร้างใบขอปรับปรุงยอดสต็อกเลขที่ ${adjustmentNumber} (${body.adjustmentType})`,
    });

    return NextResponse.json(adj);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
