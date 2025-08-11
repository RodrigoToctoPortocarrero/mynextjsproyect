import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const dia = parseInt(searchParams.get('dia'));
    const mes = parseInt(searchParams.get('mes'));
    const anio = parseInt(searchParams.get('anio'));
    const iddocente = parseInt(searchParams.get('iddocente'));

    if (!dia || !mes || !anio || !iddocente) {
      return NextResponse.json(
        { error: 'Debe enviar día, mes, año y iddocente' },
        { status: 400 }
      );
    }

    // Rango exacto de ese día
    const fechaInicio = new Date(anio, mes - 1, dia, 0, 0, 0);
    const fechaFin = new Date(anio, mes - 1, dia, 23, 59, 59);

    const clases = await prisma.clase.findMany({
      where: {
        iddocente,
        fechaclase: {
          gte: fechaInicio,
          lte: fechaFin
        }
      },
      select: {
        idclase: true,
        tituloclase: true,
        fechaclase: true,
        competencia: true,
        presentacion: true,
        grados: true,
        curso: {
          select: { nombrecurso: true }
        }
      },
      orderBy: { fechaclase: 'asc' }
    });

    return NextResponse.json({
      iddocente,
      dia,
      mes,
      anio,
      cantidadClases: clases.length,
      clases
    });
  } catch (error) {
    console.error('Error en reporte 4:', error);
    return NextResponse.json(
      { error: 'Error interno al obtener datos' },
      { status: 500 }
    );
  }
}
