/**
 * Facts come from Kaif's two resumes, his GitHub profile and his earlier portfolio sites.
 * Edit here and the whole site updates.
 */
export const profile = {
  firstName: 'Kaif',
  middleName: 'Ahmed',
  lastName: 'Sherdi',
  fullName: 'Kaif Ahmed Sherdi',
  initials: 'KAS',
  role: 'Full Stack Developer',
  roles: ['Full Stack Developer', 'React.js Engineer', 'Laravel API Builder', 'UI Motion Craftsman'],
  location: 'Hubli, Karnataka, India',
  availability: 'Open to full-time & freelance — remote or on-site',
  email: 'kaifsherdi19@gmail.com',
  phone: '+91 78297 47061',
  phoneHref: 'tel:+917829747061',
  whatsapp: 'https://wa.me/917829747061',
  github: 'https://github.com/kaifsherdi1',
  linkedin: 'https://www.linkedin.com/in/kaif-ahmed-sherdi-815b25297/',
  resumes: [
    { label: 'Full Stack Resume', href: '/resume/Kaif-Ahmed-Sherdi-Fullstack-Resume.pdf' },
    { label: 'React Resume', href: '/resume/Kaif-Ahmed-Sherdi-React-Resume.pdf' },
  ],
  intro:
    'Full stack developer with 2+ years shipping production web apps in React.js and Laravel — multi-vendor e-commerce, SaaS products, HRMS, trading and finance dashboards.',
  about: [
    'I build the whole product: React interfaces that feel fast and alive, and Laravel APIs that keep them secure and honest.',
    'Over two years I have shipped e-commerce platforms, SaaS products, HRMS and finance systems, admin dashboards and business websites — from the first Figma frame to production.',
    'I care about clean UI, smooth motion with GSAP and Framer Motion, role-based security, and performance you can feel: lazy loading, code splitting, memoization and server-side pagination.',
  ],
}

export const stats = [
  { value: 2, suffix: '+', label: 'Years building production apps' },
  { value: 5, suffix: '+', label: 'Production business applications' },
  { value: 35, suffix: '+', label: 'REST APIs designed & integrated' },
  { value: 200, suffix: '+', label: 'DSA problems solved' },
]

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
]

export const socials = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'WhatsApp', href: profile.whatsapp },
  { label: 'Email', href: `mailto:${profile.email}` },
]
