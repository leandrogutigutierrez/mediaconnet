import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Opportunity from '@/models/Opportunity';
import Application from '@/models/Application';

// ─── Protected seed endpoint ──────────────────────────────────────────────────
export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    if (secret !== 'mediaconnet2026') {
      return NextResponse.json({ error: 'Seed not available in production' }, { status: 403 });
    }
  }

  await connectDB();

  // Clean existing seed data (by seed emails)
  const seedEmails = [
    'sofia.mendez@mediaconnet.dev',
    'carlos.rivera@mediaconnet.dev',
    'valentina.torres@mediaconnet.dev',
    'prism.studios@mediaconnet.dev',
  ];
  await User.deleteMany({ email: { $in: seedEmails } });

  const password = await bcrypt.hash('demo1234', 12);

  // ─────────────────────────────────────────────────────────────────────────────
  // STUDENT 1 — Sofia Mendez · Video Editor
  // ─────────────────────────────────────────────────────────────────────────────
  const sofia = await User.create({
    name:     'Sofia Mendez',
    email:    'sofia.mendez@mediaconnet.dev',
    password,
    role:     'student',
    avatar:   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    career:   'Tecnología en Producción Transmedia',
    bio:      'Editora de video apasionada con 3 años de experiencia en producción audiovisual. Me especializo en narrativa visual, color grading y efectos de movimiento. He colaborado en cortometrajes independientes, campañas publicitarias para marcas locales y contenido para plataformas digitales. Busco proyectos donde pueda combinar creatividad técnica con storytelling auténtico.',
    location: 'Cali, Colombia',
    skills:   ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Color Grading', 'Motion Graphics', 'Storytelling', 'Final Cut Pro'],
    portfolio: [
      {
        title:       'Campaña "Raíces" — Marca de café colombiano',
        description: 'Video documental de 3 minutos para una marca artesanal de café del Valle del Cauca. Dirigido, editado y con color grading completo. Logró 85k views orgánicos en Instagram.',
        mediaType:   'video',
        url:         'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail:   'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop',
      },
      {
        title:       'Cortometraje "Entre Sombras"',
        description: 'Cortometraje de ficción de 12 minutos. Responsable de la edición, diseño de sonido y color grading. Seleccionado en el Festival de Cine Estudiantil USC 2024.',
        mediaType:   'video',
        url:         'https://vimeo.com/example',
        thumbnail:   'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=400&fit=crop',
      },
      {
        title:       'Motion Graphics — Intro corporativa',
        description: 'Pack de animaciones corporativas para empresa de tecnología. Incluye intro, lower thirds y outro. Elaborado en After Effects con duración de 30 segundos.',
        mediaType:   'image',
        url:         'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop',
        thumbnail:   'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop',
      },
    ],
    socialLinks: {
      linkedin:  'https://linkedin.com/in/sofia-mendez',
      instagram: 'https://instagram.com/sofiamendez.video',
      behance:   'https://behance.net/sofiamendez',
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // STUDENT 2 — Carlos Rivera · Fotografía & Social Media
  // ─────────────────────────────────────────────────────────────────────────────
  const carlos = await User.create({
    name:     'Carlos Rivera',
    email:    'carlos.rivera@mediaconnet.dev',
    password,
    role:     'student',
    avatar:   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    career:   'Comunicación Digital y Transmedia',
    bio:      'Fotógrafo y creador de contenido digital con enfoque en branding visual y estrategia de redes sociales. He trabajado con más de 15 marcas locales desarrollando su identidad visual online. Creo que cada marca tiene una historia única y mi trabajo es contarla a través de imágenes que conecten emocionalmente con la audiencia.',
    location: 'Bogotá, Colombia',
    skills:   ['Fotografía', 'Lightroom', 'Photoshop', 'Social Media', 'Estrategia de Contenido', 'Canva', 'Instagram Reels', 'Copywriting'],
    portfolio: [
      {
        title:       'Identidad visual — Restaurante "Sabor Nativo"',
        description: 'Sesión fotográfica completa para restaurante de comida colombiana. 120 fotos para redes sociales, menú digital y página web. Incremento del 40% en engagement en Instagram tras la campaña.',
        mediaType:   'image',
        url:         'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
        thumbnail:   'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop',
      },
      {
        title:       'Campaña Social Media — "Verde Vivo" tienda ecológica',
        description: 'Estrategia de contenido de 3 meses para tienda de productos sostenibles. Diseño de feed, stories, reels y calendario editorial. Crecimiento de 0 a 8.000 seguidores.',
        mediaType:   'image',
        url:         'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
        thumbnail:   'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
      },
      {
        title:       'Fotografía de producto — Joyería artesanal',
        description: 'Serie de fotografías de producto para catálogo e-commerce. Fondo blanco, lifestyle y flat lay. Más de 200 piezas fotografiadas para tienda online.',
        mediaType:   'image',
        url:         'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop',
        thumbnail:   'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop',
      },
    ],
    socialLinks: {
      linkedin:  'https://linkedin.com/in/carlosrivera-foto',
      instagram: 'https://instagram.com/carlos.rivera.foto',
      behance:   'https://behance.net/carlosrivera',
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // STUDENT 3 — Valentina Torres · Motion Graphics & Animación
  // ─────────────────────────────────────────────────────────────────────────────
  const valentina = await User.create({
    name:     'Valentina Torres',
    email:    'valentina.torres@mediaconnet.dev',
    password,
    role:     'student',
    avatar:   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    career:   'Diseño y Producción Transmedia',
    bio:      'Diseñadora de movimiento y animadora 2D/3D con pasión por crear experiencias visuales inmersivas. Me especializo en motion graphics para publicidad, openings para podcasts y series web, e infografías animadas. Fanática del diseño basado en tipografía y creo firmemente que el movimiento puede transformar cualquier mensaje en una experiencia memorable.',
    location: 'Medellín, Colombia',
    skills:   ['After Effects', 'Cinema 4D', 'Illustrator', 'Motion Graphics', 'Animación 2D', 'Diseño Tipográfico', 'Lottie / JSON', 'Blender'],
    portfolio: [
      {
        title:       'Opening animado — Podcast "Mentes Creativas"',
        description: 'Secuencia de apertura de 15 segundos para podcast de creatividad y diseño. Animación tipográfica con partículas y transiciones fluidas. Disponible en Spotify y YouTube.',
        mediaType:   'video',
        url:         'https://vimeo.com/example2',
        thumbnail:   'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=400&fit=crop',
      },
      {
        title:       'Infografía animada — Impacto ambiental del plástico',
        description: 'Video infográfico de 2 minutos para ONG ambiental. Datos estadísticos visualizados con animaciones dinámicas. Compartido por el Ministerio de Medio Ambiente en redes oficiales.',
        mediaType:   'image',
        url:         'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop',
        thumbnail:   'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop',
      },
      {
        title:       'Branding animado — App "Fitflow"',
        description: 'Pack completo de animaciones de marca para aplicación de fitness: splash screen, transiciones, íconos animados e ilustraciones en movimiento. Implementado en la versión 2.0 de la app.',
        mediaType:   'link',
        url:         'https://behance.net/valentinatorres/fitflow',
        thumbnail:   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      },
    ],
    socialLinks: {
      linkedin:  'https://linkedin.com/in/valentina-torres-motion',
      instagram: 'https://instagram.com/valen.motion',
      behance:   'https://behance.net/valentinatorres',
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPANY — Prism Studios
  // ─────────────────────────────────────────────────────────────────────────────
  const prism = await User.create({
    name:        'Prism Studios',
    email:       'prism.studios@mediaconnet.dev',
    password,
    role:        'company',
    avatar:      'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop',
    companyName: 'Prism Studios',
    industry:    'Producción Creativa y Publicidad',
    website:     'https://prismstudios.co',
    description: 'Prism Studios es una agencia creativa boutique fundada en 2018, especializada en producción audiovisual, branding digital y estrategia de contenidos para marcas que quieren destacar. Hemos trabajado con más de 80 clientes en Colombia, México y España. Creemos en el talento emergente y constantemente buscamos estudiantes apasionados con perspectivas frescas para unirse a nuestros proyectos. Nuestro equipo es 100% remoto y valoramos la autonomía creativa.',
    location:    'Cali, Colombia',
    socialLinks: {
      linkedin:  'https://linkedin.com/company/prism-studios-co',
      instagram: 'https://instagram.com/prismstudios.co',
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // OPPORTUNITIES — posted by Prism Studios
  // ─────────────────────────────────────────────────────────────────────────────
  const opp1 = await Opportunity.create({
    company:      prism._id,
    title:        'Editor de Video para Campaña de Marca — Sector Moda',
    description:  'Buscamos un editor de video talentoso para una campaña publicitaria de una marca de moda sostenible colombiana. El proyecto incluye edición de 4 videos de 30-60 segundos para Instagram y YouTube, con color grading, music sync y subtítulos. Tenemos todo el material filmado y necesitamos tu magia en postproducción.\n\nEl trabajo es 100% remoto con reuniones semanales de seguimiento por Google Meet. Duración estimada: 3 semanas.',
    requirements: [
      'Portfolio con al menos 2 proyectos de edición de video',
      'Dominio de Premiere Pro o DaVinci Resolve',
      'Disponibilidad de 15-20 horas semanales',
      'Capacidad para entregar en los plazos acordados',
      'Comunicación fluida y actitud proactiva',
    ],
    skills:       ['Premiere Pro', 'DaVinci Resolve', 'Color Grading', 'After Effects', 'Edición de Video'],
    category:     'video',
    location:     'Remoto',
    modality:     'remote',
    compensation: 'Remunerado — COP $800.000 por proyecto',
    deadline:     new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isActive:     true,
  });

  const opp2 = await Opportunity.create({
    company:      prism._id,
    title:        'Creador/a de Contenido para Redes Sociales — Cliente Gastronómico',
    description:  'Prism Studios busca un creador de contenido para gestionar las redes sociales de un reconocido restaurante de Cali durante 2 meses. El rol incluye: planeación del calendario de contenido, fotografía y video de platos y ambiente, redacción de copys, gestión de comunidad y análisis de métricas semanales.\n\nIdeal para estudiantes de comunicación o producción transmedia que quieran su primera experiencia real con una marca establecida. Posibilidad de vinculación a largo plazo según desempeño.',
    requirements: [
      'Conocimiento de Instagram, TikTok y Facebook Business',
      'Habilidades básicas de fotografía con smartphone o cámara',
      'Capacidad de redacción creativa para redes',
      'Residir en Cali o disponibilidad para visitas al restaurante',
      'Conocimiento de Meta Business Suite',
    ],
    skills:       ['Social Media', 'Fotografía', 'Copywriting', 'Canva', 'Estrategia de Contenido', 'TikTok'],
    category:     'social-media',
    location:     'Cali, Colombia',
    modality:     'hybrid',
    compensation: 'Remunerado — COP $600.000/mes + comisión por crecimiento',
    deadline:     new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    isActive:     true,
  });

  const opp3 = await Opportunity.create({
    company:      prism._id,
    title:        'Animador/a Motion Graphics — Documental Interactivo',
    description:  'Estamos produciendo un documental interactivo sobre la cultura cafetera colombiana para una plataforma de streaming regional. Necesitamos un animador de motion graphics para crear las infografías animadas, transiciones, mapa interactivo y secuencias de título del proyecto.\n\nEl documental tiene una duración de 40 minutos y el trabajo de animación representa aproximadamente 8-10 minutos de contenido animado. Fecha de entrega final: 6 semanas desde el inicio. Trabajo completamente remoto.',
    requirements: [
      'Portafolio de motion graphics o animación 2D',
      'Dominio de After Effects (obligatorio)',
      'Conocimiento de Illustrator para preparación de assets',
      'Capacidad de trabajo autónomo y cumplimiento de deadlines',
      'Plus: experiencia con Lottie o animaciones para web',
    ],
    skills:       ['After Effects', 'Motion Graphics', 'Illustrator', 'Animación 2D', 'Cinema 4D'],
    category:     'documentary',
    location:     'Remoto',
    modality:     'remote',
    compensation: 'Remunerado — COP $1.200.000 por el proyecto completo',
    deadline:     new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isActive:     true,
  });

  // ─── Sample applications ──────────────────────────────────────────────────
  await Application.create({
    opportunity: opp1._id,
    student:     sofia._id,
    coverLetter: 'Hola equipo de Prism Studios, me emociona mucho esta oportunidad. He editado varios proyectos de moda y lifestyle que pueden ver en mi portafolio. Tengo amplia experiencia en color grading para contenido de moda y estoy disponible para iniciar de inmediato. ¡Espero poder colaborar con ustedes!',
    status:      'pending',
  });

  await Application.create({
    opportunity: opp3._id,
    student:     valentina._id,
    coverLetter: 'El documental sobre la cultura cafetera es exactamente el tipo de proyecto en el que quiero participar. Tengo experiencia creando infografías animadas y motion graphics para documentales y mi estilo visual encaja perfectamente con el tema. Adjunto mi portafolio con trabajos similares.',
    status:      'accepted',
  });

  await Application.create({
    opportunity: opp2._id,
    student:     carlos._id,
    coverLetter: 'Tengo experiencia directa gestionando redes sociales de restaurantes en Cali y conozco muy bien el sector gastronómico de la ciudad. Mi portafolio incluye el caso "Sabor Nativo" donde logré resultados medibles. Podría comenzar esta misma semana.',
    status:      'pending',
  });

  return NextResponse.json({
    success: true,
    message: '✅ Seed completado exitosamente',
    data: {
      students: [
        { name: sofia.name,     email: sofia.email     },
        { name: carlos.name,    email: carlos.email    },
        { name: valentina.name, email: valentina.email },
      ],
      company: { name: prism.companyName, email: prism.email },
      opportunities: [
        opp1.title,
        opp2.title,
        opp3.title,
      ],
      password_for_all: 'demo1234',
    },
  });
}
