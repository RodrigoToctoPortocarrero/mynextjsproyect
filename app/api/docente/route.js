import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const docentes = await prisma.docente.findMany({
      select: {
        iddocente: true,
        nombre: true,
        apellidopaterno: true,
        apellidomaterno: true
      },
      orderBy: [
        { apellidopaterno: 'asc' },
        { apellidomaterno: 'asc' },
        { nombre: 'asc' }
      ]
    });

    return new Response(JSON.stringify(docentes), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    return new Response(JSON.stringify({ error: 'Error en el servidor' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
