import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* 3D simplex noise (Ashima / Stefan Gustavson) for the vertex displacement. */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`

const coreVertex = /* glsl */ `
uniform float uTime; uniform float uAmp; uniform vec2 uMouse;
varying vec3 vNormal; varying vec3 vView; varying float vNoise;
${NOISE}
void main(){
  vec3 p = position;
  float n = snoise(normal * 1.4 + vec3(uTime * 0.25, uTime * 0.18, uMouse.x * 0.6));
  float n2 = snoise(normal * 3.2 - uTime * 0.3) * 0.35;
  float d = (n + n2) * uAmp;
  p += normal * d;
  vNoise = n;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`

const coreFragment = /* glsl */ `
uniform float uTime;
varying vec3 vNormal; varying vec3 vView; varying float vNoise;
void main(){
  float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
  vec3 ember = vec3(1.0, 0.353, 0.122);
  vec3 ion = vec3(0.545, 0.424, 1.0);
  vec3 mint = vec3(0.24, 0.96, 0.71);
  float t = vNoise * 0.5 + 0.5;
  vec3 base = mix(ion, ember, smoothstep(0.15, 0.85, t));
  base = mix(base, mint, smoothstep(0.75, 1.0, fres) * 0.55);
  // iridescent bands
  float bands = sin((vNoise + uTime * 0.15) * 9.0) * 0.5 + 0.5;
  vec3 col = base * (0.18 + 0.55 * fres) + bands * 0.06 * base + fres * 0.65 * mix(ember, ion, bands);
  gl_FragColor = vec4(col, 1.0);
}`

/**
 * The hero's 3D "core": a living, noise-deformed sphere inside a wireframe
 * icosahedron, two particle orbits and a drifting star field. It renders only
 * while visible, caps DPR, and scales its detail down on small screens.
 */
export default function HeroScene({ className = '' }) {
  const mount = useRef(null)

  useEffect(() => {
    const el = mount.current
    const small = window.innerWidth < 768
    const renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 1.75))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0, 7.5)

    const group = new THREE.Group()
    scene.add(group)

    // living core
    const uniforms = { uTime: { value: 0 }, uAmp: { value: 0.32 }, uMouse: { value: new THREE.Vector2() } }
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, small ? 48 : 96),
      new THREE.ShaderMaterial({ vertexShader: coreVertex, fragmentShader: coreFragment, uniforms }),
    )
    group.add(core)

    // wireframe shell
    const shell = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.35, 1)),
      new THREE.LineBasicMaterial({ color: 0xf4f1ea, transparent: true, opacity: 0.12 }),
    )
    group.add(shell)

    // shell vertices glow
    const shellPts = new THREE.Points(
      new THREE.IcosahedronGeometry(2.35, 1),
      new THREE.PointsMaterial({ color: 0xff5a1f, size: 0.06, transparent: true, opacity: 0.9, sizeAttenuation: true }),
    )
    group.add(shellPts)

    // orbits
    const makeRing = (count, radius, spread, color, size) => {
      const pos = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2
        const r = radius + (Math.random() - 0.5) * spread
        pos[i * 3] = Math.cos(a) * r
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.4
        pos[i * 3 + 2] = Math.sin(a) * r
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      return new THREE.Points(g, new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending }))
    }
    const ringA = makeRing(small ? 500 : 1100, 3.1, 0.5, 0xff8a4f, 0.025)
    ringA.rotation.set(1.15, 0, 0.35)
    const ringB = makeRing(small ? 350 : 800, 3.7, 0.35, 0x8b6cff, 0.022)
    ringB.rotation.set(1.9, 0.4, -0.5)
    group.add(ringA, ringB)

    // star field
    const starCount = small ? 500 : 1400
    const stars = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      stars[i * 3] = (Math.random() - 0.5) * 30
      stars[i * 3 + 1] = (Math.random() - 0.5) * 18
      stars[i * 3 + 2] = -Math.random() * 20 - 2
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(stars, 3))
    const starField = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xf4f1ea, size: 0.03, transparent: true, opacity: 0.55, depthWrite: false }),
    )
    scene.add(starField)

    // sizing — the core sits to the right on wide screens, centred on mobile
    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      const wide = w / h > 1.1
      group.position.x = wide ? 2.75 : 0
      group.position.y = wide ? -0.1 : -1.25
      group.scale.setScalar(wide ? 0.82 : 0.6)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    // interaction
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    let scrollP = 0
    const onScroll = () => {
      scrollP = Math.min(window.scrollY / window.innerHeight, 1.5)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // render only while on screen
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)

    const clock = new THREE.Clock()
    let raf
    let intro = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible || document.hidden) return
      const t = clock.getElapsedTime()
      intro = Math.min(intro + 0.012, 1)
      const ease = 1 - Math.pow(1 - intro, 3)

      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      uniforms.uTime.value = t
      uniforms.uMouse.value.set(mouse.x, mouse.y)
      uniforms.uAmp.value = 0.28 + Math.abs(mouse.x) * 0.12 + scrollP * 0.25

      core.rotation.y = t * 0.12
      shell.rotation.y = shellPts.rotation.y = -t * 0.08 + scrollP * 1.2
      shell.rotation.x = shellPts.rotation.x = t * 0.05
      ringA.rotation.z = 0.35 + t * 0.1
      ringB.rotation.z = -0.5 - t * 0.07

      group.rotation.x = mouse.y * 0.25 + scrollP * 0.4
      group.rotation.y = mouse.x * 0.35
      const s = (0.6 + ease * 0.4) * (1 - scrollP * 0.15)
      core.scale.setScalar(s)
      shell.scale.setScalar(s)
      shellPts.scale.setScalar(s)
      starField.position.x = -mouse.x * 0.4
      starField.position.y = mouse.y * 0.3 + scrollP * 1.5

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      scene.traverse((o) => {
        o.geometry?.dispose()
        o.material?.dispose()
      })
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mount} aria-hidden="true" className={`[&>canvas]:h-full [&>canvas]:w-full ${className}`} />
}
