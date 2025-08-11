import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const cursos = await prisma.curso.findMany({
      select: {
        idcurso: true,
        nombrecurso: true
      }
    });

    return new Response(JSON.stringify(cursos), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener cursos:', error);
    return new Response(JSON.stringify({ error: 'Error en el servidor' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
