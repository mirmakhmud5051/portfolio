import type { Bilingual } from './skills'

export type ExpertiseItem = {
  id: string
  title: Bilingual
  description: Bilingual
  tags: string[]
  status: 'active' | 'soon'
}

export const expertise: ExpertiseItem[] = [
  {
    id: 'frontend',
    title: { en: 'Frontend Development', uz: 'Frontend dasturlash' },
    description: {
      en: 'Design systems, component architecture and production-ready React apps that stay fast as they grow.',
      uz: 'Dizayn tizimlari, komponent arxitekturasi va o‘sgan sari tezligini yo‘qotmaydigan production React ilovalar.',
    },
    tags: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
    status: 'active',
  },
  {
    id: 'creative',
    title: { en: 'Creative Development', uz: 'Creative development' },
    description: {
      en: 'Scroll-driven storytelling, WebGL scenes and micro-interactions that give a product its personality.',
      uz: 'Scroll bilan boshqariladigan hikoyalar, WebGL sahnalar va mahsulotga xarakter beradigan mikro-interaksiyalar.',
    },
    tags: ['Three.js', 'R3F', 'GSAP', 'Shaders'],
    status: 'active',
  },
  {
    id: 'backend',
    title: { en: 'Backend & APIs', uz: 'Backend va API' },
    description: {
      en: 'The next chapter: APIs, auth and data layers. Learning in public and building small tools along the way.',
      uz: 'Keyingi bob: API, auth va ma’lumot qatlamlari. Ochiq holda o‘rganyapman va yo‘lda kichik asboblar yasayapman.',
    },
    tags: ['Node.js', 'REST', 'PostgreSQL'],
    status: 'soon',
  },
]
