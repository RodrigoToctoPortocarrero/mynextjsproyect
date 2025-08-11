//API, para listar clases segun un docente especifico

// /app/api/clase/docente/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const iddocente = searchParams.get('iddocente');

    if (!iddocente) {
      return NextResponse.json(
        { error: 'El parámetro iddocente es requerido' },
        { status: 400 }
      );
    }

    const clases = await prisma.clase.findMany({
      where: { iddocente: parseInt(iddocente) },
      include: {
        curso: { select: { nombrecurso: true } }
      }
    });

    return NextResponse.json(clases);
  } catch (error) {
    console.error('Error al obtener clases por docente:', error);
    return NextResponse.json(
      { error: 'Error interno al obtener datos' },
      { status: 500 }
    );
  }
}
