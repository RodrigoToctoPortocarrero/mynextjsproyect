import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const idcurso = parseInt(searchParams.get('curso'));

  const competencias = await prisma.competencia.findMany({
    where: { idcurso },
  });

  return NextResponse.json(competencias);
}
