import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fecha = searchParams.get('fecha');

    if (!fecha) {
      return NextResponse.json(
        { error: 'El parámetro fecha es requerido' },
        { status: 400 }
      );
    }

    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    fechaFin.setDate(fechaFin.getDate() + 1);

    const clases = await prisma.clase.findMany({
      where: {
        fechaclase: {
          gte: fechaInicio,
          lt: fechaFin
        }
      },
      include: {
        docente: {
          select: {
            iddocente: true,
            nombre: true,
            apellidopaterno: true,
            apellidomaterno: true
          }
        },
        curso: {
          select: { nombrecurso: true }
        }
      }
    });

    return NextResponse.json(clases);
  } catch (error) {
    console.error('Error en reporte 2:', error);
    return NextResponse.json(
      { error: 'Error interno al obtener datos' },
      { status: 500 }
    );
  }
}
