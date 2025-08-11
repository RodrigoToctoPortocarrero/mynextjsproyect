import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mes = parseInt(searchParams.get('mes'));
    const anio = parseInt(searchParams.get('anio'));
    const iddocente = parseInt(searchParams.get('iddocente'));

    if (!mes || !anio || !iddocente) {
      return NextResponse.json(
        { error: 'Debe enviar mes, año y iddocente' },
        { status: 400 }
      );
    }

    // Rango de fechas
    const fechaInicio = new Date(anio, mes - 1, 1);
    const fechaFin = new Date(anio, mes, 1);

    // Clases del docente en ese mes
    const clases = await prisma.clase.findMany({
      where: {
        iddocente: iddocente,
        fechaclase: {
          gte: fechaInicio,
          lt: fechaFin
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
          select: {
            nombrecurso: true
          }
        }
      },
      orderBy: { fechaclase: 'asc' }
    });

    return NextResponse.json({
      iddocente,
      mes,
      anio,
      cantidadClases: clases.length,
      clases
    });
  } catch (error) {
    console.error('Error en reporte 3:', error);
    return NextResponse.json(
      { error: 'Error interno al obtener datos' },
      { status: 500 }
    );
  }
}
