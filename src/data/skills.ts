export type Bilingual = {
  en: string
  uz: string
}

export type Skill = {
  name: string
  category: Bilingual
  level: number
}

export const skills: Skill[] = [
  { name: 'React', category: { en: 'Core', uz: 'Asos' }, level: 94 },
  { name: 'TypeScript', category: { en: 'Core', uz: 'Asos' }, level: 90 },
  { name: 'Next.js', category: { en: 'Core', uz: 'Asos' }, level: 84 },
  {
    name: 'Three.js / R3F',
    category: { en: 'Creative', uz: 'Creative' },
    level: 80,
  },
  {
    name: 'GSAP / Motion',
    category: { en: 'Creative', uz: 'Creative' },
    level: 88,
  },
  {
    name: 'HTML / CSS',
    category: { en: 'Craft', uz: 'Hunarmandlik' },
    level: 92,
  },
]

export const tools: string[] = [
  'Vite',
  'Git',
  'GitHub',
  'Figma',
  'Framer Motion',
  'REST API',
  'Vercel',
  'Vitest',
]
