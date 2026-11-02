import type { Bilingual } from './skills'

export type Project = {
  id: string
  no: string
  title: string
  monogram: string
  category: Bilingual
  description: Bilingual
  role: Bilingual
  year: string
  tech: string[]
  accent: string
  href: string
}

export const projects: Project[] = [
  {
    id: 'nova',
    no: '01',
    title: 'Nova Commerce',
    monogram: 'N',
    category: { en: 'E-commerce / Storefront', uz: 'E-commerce / Do‘kon' },
    description: {
      en: 'A cinematic storefront built around a WebGL product configurator, seamless page transitions and a checkout that never gets in the way.',
      uz: 'WebGL mahsulot konfiguratori, uzluksiz sahifa o‘tishlari va hech qachon xalaqit bermaydigan checkout atrofida qurilgan kinematografik do‘kon.',
    },
    role: {
      en: 'Frontend & interaction',
      uz: 'Frontend va interaksiya',
    },
    year: '2026',
    tech: ['React', 'TypeScript', 'Three.js', 'GSAP'],
    accent: '#d7ff3e',
    href: '#contact',
  },
  {
    id: 'orbit',
    no: '02',
    title: 'Orbit Dashboard',
    monogram: 'O',
    category: { en: 'SaaS / Analytics', uz: 'SaaS / Analitika' },
    description: {
      en: 'A real-time analytics workspace designed around dense data, calm motion and a component system that scales across product teams.',
      uz: 'Zich ma’lumotlar, xotirjam harakat va mahsulot jamoalari bo‘ylab kengayadigan komponent tizimi atrofida qurilgan real-time analitika ish maydoni.',
    },
    role: {
      en: 'Product frontend',
      uz: 'Mahsulot frontendi',
    },
    year: '2025',
    tech: ['Next.js', 'TypeScript', 'D3', 'Tailwind'],
    accent: '#c9d1c4',
    href: '#contact',
  },
  {
    id: 'aether',
    no: '03',
    title: 'Aether Studio',
    monogram: 'A',
    category: { en: 'Creative / Agency', uz: 'Creative / Agentlik' },
    description: {
      en: 'An immersive agency site pairing scroll-driven 3D scenes with editorial typography and a component library ready for the next campaign.',
      uz: 'Scroll bilan boshqariladigan 3D sahnalar, editorial tipografiya va keyingi kampaniyaga tayyor komponentlar kutubxonasini birlashtirgan immersiv agentlik sayti.',
    },
    role: {
      en: 'Creative development',
      uz: 'Creative development',
    },
    year: '2025',
    tech: ['Three.js', 'React Three Fiber', 'GSAP', 'Vite'],
    accent: '#9fae94',
    href: '#contact',
  },
]
