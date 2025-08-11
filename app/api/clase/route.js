// /app/api/clase/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const clases = await prisma.clase.findMany();
  return NextResponse.json(clases);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      idcurso,
      iddocente,
      competencia,
      fechaclase,
      tituloclase,
      presentacion,
      grados
    } = body;

    if (!idcurso || !iddocente || !competencia || !fechaclase || !tituloclase) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben ser completados' },
        { status: 400 }
      );
    }

    const nuevaClase = await prisma.clase.create({
      data: {
        idcurso: parseInt(idcurso),
        iddocente: parseInt(iddocente),
        fechaclase: new Date(fechaclase),
        tituloclase,
        presentacion: presentacion === 'true',
        competencia,
        grados
      }
    });

    return NextResponse.json(nuevaClase, { status: 201 });
  } catch (error) {
    console.error('Error al insertar clase:', error);
    return NextResponse.json(
      { error: 'Error interno al guardar la clase' },
      { status: 500 }
    );
  }
}
