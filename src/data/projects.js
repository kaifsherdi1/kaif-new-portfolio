/**
 * Project facts come from Kaif's resumes and each repository's README / file tree.
 * `image` is a real screenshot; otherwise `art` picks the generated visual in <ProjectVisual />.
 * `hue` tints the card glow.
 */
import letsshop from '../assets/letsshop.webp'
import zidaan from '../assets/zidaan.webp'
import imart from '../assets/imart.webp'

export const projects = [
  {
    slug: 'letsshop',
    title: 'LetsShop',
    tagline: 'Enterprise multi-vendor e-commerce platform',
    category: 'E-commerce · Full stack',
    year: '2026',
    hue: '#4FB3A6',
    art: 'store',
    image: { src: letsshop, alt: 'The LetsShop storefront homepage' },
    live: 'https://lets-shop-gold.vercel.app',
    repo: 'https://github.com/kaifsherdi1/lets_shop',
    stack: ['React.js', 'Redux Toolkit', 'Tailwind CSS', 'Laravel 11', 'MySQL', 'Sanctum', 'Razorpay', 'Framer Motion'],
    summary:
      'A multi-vendor marketplace with seven user roles: distributors manage products and commissions, customers shop, pay and track every order end to end.',
    metrics: [
      { value: '35+', label: 'REST APIs' },
      { value: '7', label: 'User roles' },
      { value: '21', label: 'DB tables' },
    ],
    points: [
      '35+ Laravel 11 REST APIs covering OTP authentication, catalogue, cart, orders, commissions and wallets, secured with Sanctum.',
      'Seven-role RBAC — Admin, Manager, Accountant, HR, Distributor, Agent and Customer — with protected routes on every dashboard.',
      'Commission approval workflow, wallet with withdrawal requests and dual-currency pricing in INR and AED.',
      'Full order lifecycle with automatic stock reduce / restore, Razorpay checkout and real-time order notifications over WebSockets.',
      'Redux Toolkit for auth and cart persistence; server-side pagination, advanced filtering and lazy loading for speed.',
      'Storefront and admin built with React Router, Framer Motion, GSAP and React Hot Toast; deployed on Vercel.',
    ],
  },
  {
    slug: 'zidaan-architecture',
    title: 'Zidaan Architecture',
    tagline: 'Real estate management platform',
    category: 'PropTech · Full stack',
    year: '2026',
    hue: '#E7B36A',
    art: 'estate',
    image: { src: zidaan, alt: 'The Zidaan Architectures homepage' },
    live: 'https://zidaan-architecture.vercel.app/',
    repo: 'https://github.com/kaifsherdi1/zidaan-architecture',
    stack: ['React.js', 'Context API', 'Tailwind CSS', 'Laravel 10', 'MySQL', 'Redis', 'Recharts', 'GSAP'],
    summary:
      'Three apps in one system — a public property portal, an admin & agent dashboard and a Laravel API — for properties, agents, viewings and transactions.',
    metrics: [
      { value: '3', label: 'Connected apps' },
      { value: '3', label: 'Roles' },
      { value: 'PDF', label: 'Auto invoices' },
    ],
    points: [
      'Admin, Agent and User flows behind granular role-based permissions.',
      'Property-viewing bookings that move from request to approval, with email notifications.',
      'Transaction tracking with auto-generated PDF invoices, Excel import / export and PDF reports.',
      'Advanced CRUD with filtering, sorting, pagination, soft delete and restore.',
      'Redis caching, Eloquent optimisation, queues and background jobs on the API; Swagger API docs.',
      'Recharts analytics and Framer Motion / GSAP animation on a component-driven React UI.',
    ],
  },
  {
    slug: 'business-websites',
    title: 'Client Websites',
    tagline: 'Responsive websites for real businesses',
    category: 'Client work · Live',
    year: '2024 — 2025',
    hue: '#E2453C',
    art: 'sites',
    live: 'https://redfreshbharath.com/',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'GSAP'],
    summary:
      'Responsive, mobile-first websites and landing pages delivered for businesses in India and the UAE.',
    metrics: [
      { value: '10+', label: 'Websites shipped' },
      { value: '5', label: 'Featured clients' },
      { value: '100%', label: 'Responsive' },
    ],
    clients: ['Red Fresh Bharat', 'IR International Pvt Ltd', 'Naba Al Masarat United', 'Elite World Pro', 'Tawfiq Careers'],
    points: [
      'Live client sites for Red Fresh Bharat, IR International Pvt Ltd, Naba Al Masarat United, Elite World Pro and Tawfiq Careers.',
      'Landing pages, reusable sections, forms and interactive UI components.',
      'Clean, mobile-friendly layouts built with HTML, CSS, JavaScript and Bootstrap.',
    ],
  },
  {
    slug: 'imart-saas',
    title: 'iMart SaaS',
    tagline: 'Multi-store e-commerce & ERP platform',
    category: 'SaaS · ERP',
    year: '2026',
    hue: '#D9643A',
    art: 'saas',
    image: { src: imart, alt: 'The iMart multi-tenant marketplace homepage' },
    live: 'https://imart-saas-application.vercel.app/',
    repo: 'https://github.com/kaifsherdi1/imart-saas-application',
    extraRepo: { label: 'API source', href: 'https://github.com/kaifsherdi1/ibackend' },
    stack: ['Next.js', 'TypeScript', 'Redux Toolkit', 'Laravel 12', 'Spatie RBAC', 'Razorpay', 'Tailwind 4', 'Lenis'],
    summary:
      'An enterprise ERP and storefront API with subscriptions, store management, a distributor hierarchy, wallets, EMI applications and invoicing.',
    metrics: [
      { value: '7', label: 'Roles (Spatie)' },
      { value: 'OTP', label: 'SMS login' },
      { value: 'EMI', label: 'Financing flow' },
    ],
    points: [
      'Spatie RBAC with seven roles, Sanctum auth and OTP login over SMS.',
      'Product variants and combo products, Excel import / export, coupons, cart, wishlist and order tracking.',
      'Razorpay payments, PDF invoices, activity logs, wallets and payout requests.',
      'Store subscriptions and plans, EMI applications and reviews in the SaaS layer.',
      'State → district → city → zone hierarchy for distributors; repository and service pattern with feature tests.',
      'Next.js 16 frontend with Redux Toolkit, GSAP, Lenis and theme switching — catalogue, checkout, account and admin stores.',
    ],
  },
  {
    slug: 'restaurant-microservices',
    title: 'Restaurant Platform',
    tagline: 'Microservices food-ordering platform',
    category: 'Distributed systems',
    year: '2026',
    hue: '#FF5A1F',
    art: 'micro',
    repo: 'https://github.com/kaifsherdi1/restaurants-application',
    stack: ['Node.js', 'Express', 'MongoDB', 'Redis', 'RabbitMQ', 'Socket.IO', 'Docker', 'Next.js 15'],
    summary:
      'A food-ordering platform split into ten Node.js microservices behind an API gateway, with a Next.js 15 storefront.',
    metrics: [
      { value: '10', label: 'Microservices' },
      { value: 'CI/CD', label: 'GitHub Actions' },
      { value: 'Docker', label: 'Compose stack' },
    ],
    points: [
      'Auth, user, restaurant, menu, cart, order, review, location, notification and analytics services — each with its own MongoDB.',
      'Express API gateway with JWT, rate limiting, Helmet, Redis and Socket.IO; Nginx gateway and a custom load balancer.',
      'RabbitMQ messaging between services, Winston logging and a docker-compose development stack.',
      'GitHub Actions deploy pipeline with PM2, Render and Vercel configs.',
      'Next.js 15 + React 19 frontend with React Query, GSAP and Framer Motion — restaurants, search, cart and auth.',
    ],
  },
]

export const getProject = (slug) => projects.find((p) => p.slug === slug)
