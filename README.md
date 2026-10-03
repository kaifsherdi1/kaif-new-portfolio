# Kaif Ahmed Sherdi — 3D Portfolio

An animated, interactive portfolio for **Kaif Ahmed Sherdi**, Full Stack Developer (React.js · Laravel).

- **Boot loader**: a terminal-style startup sequence that exits through staggered shutters.
- **3D hero**: a live WebGL core (noise-deformed shader sphere, wireframe shell, particle orbits) behind a hanging ID badge that swings in, tilts toward the pointer and flips to a contact card.
- **Scroll storytelling**: scrubbed word highlighting, sticky 3D-stacking experience cards, and a pinned horizontal project gallery whose cards swing in from a 3D angle.
- **Skill globe**: a draggable 3D sphere of technologies.
- **Credentials**: certificate cards that flip in 3D.
- **Navigation**: curtain page transitions into each project case study, plus a magnetic contact button and a custom cursor.

Built with **React 18 + Vite + Tailwind CSS**. Animation uses **GSAP + ScrollTrigger**, smooth scrolling uses **Lenis**, and the 3D scene uses **Three.js**.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Edit the content

All copy lives in `src/data/`:

| File | What it holds |
|---|---|
| `profile.js` | name, roles, contact links, resume files, stats, nav |
| `experience.js` | work history |
| `projects.js` | case studies (`image` = real screenshot, else `art` picks a generated mock UI) |
| `skills.js` | skill groups, globe words, marquee |
| `credentials.js` | certifications, achievements, education |

The resumes are served from `public/resume/`, and the portrait and screenshots live in `src/assets/`.

## Structure

```
src/
  animations/  gsap (setup) · scroll (Lenis, reveal helpers)
  components/  Loader · NavBar · PageTransition · Cursor · HeroScene (Three.js) · IdBadge
               SkillGlobe · ProjectVisual · TiltCard · Marquee · SplitText · Footer
  sections/    Hero · About · Experience · Work · Skills · Credentials · Contact
  pages/       Home · Project · NotFound
  hooks/       useGsap · useIntro · useMedia · useMeta
  data/        ← content
```

## Behaviour by device

- **Desktop**: everything, including the pinned horizontal gallery, stacking cards, 3D tilt and the custom cursor.
- **Tablet / mobile**: the same story stacked vertically. The 3D scene runs at lower detail, and there is no custom cursor.
- **`prefers-reduced-motion`**: no WebGL, pinning or scrubbing; short fades only.

## Deploy

The build is a static SPA. `vercel.json` and `public/_redirects` rewrite every path to `index.html`, so `/work/letsshop` works on refresh.
