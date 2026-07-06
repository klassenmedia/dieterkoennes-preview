/* ============================================================
   Dieter Koennes — Motion Layer (GSAP + ScrollTrigger + Lenis)
   Positionierung V2: Nachhaltigkeits-Moderator & Speaker
   Alle Tweens laufen nur ausserhalb prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  gsap.registerPlugin(ScrollTrigger);

  /* ---- Lenis Smooth Scroll ---- */
  const noMotion = new URLSearchParams(location.search).has("nomotion");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || noMotion;
  let lenis;

  if (!reduceMotion) {
    document.documentElement.classList.add("lenis");
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Anker-Links smooth via Lenis
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1) {
          const t = document.querySelector(id);
          if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: 0 }); }
        }
      });
    });
  }

  /* ---- Alles in matchMedia: Desktop-Animation an, sonst statisch ---- */
  const mm = gsap.matchMedia();

  /* ===== HERO: Wort-Reveal + Parallax ===== */
  if (reduceMotion) {
    // Statischer Modus: Hero sofort voll sichtbar
    gsap.set("#hero .word", { yPercent: 0, opacity: 1 });
    gsap.set("#hero .hero-fade", { y: 0, opacity: 1 });
  } else {
    // Wort-fuer-Wort-Reveal
    gsap.from("#hero .word", {
      yPercent: 120,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      stagger: 0.06,
      delay: 0.2,
    });
    gsap.from("#hero .hero-fade", {
      y: 30, opacity: 0, duration: 1, ease: "power3.out",
      stagger: 0.15, delay: 0.7,
    });

    // Hero-Bild Parallax (langsamer als Scroll)
    gsap.to("#hero .hero-bg", {
      yPercent: 18, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    });
    // Hero-Content leicht nach oben ausblenden
    gsap.to("#hero .hero-content", {
      yPercent: -12, opacity: 0.2, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    });
  }

  /* ===== Generische Scroll-Reveals ===== */
  if (reduceMotion) {
    // Statischer Modus: alles sofort sichtbar, keine ScrollTrigger-Reveals
    gsap.set(".reveal", { opacity: 1, y: 0 });
  } else {
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });
  }

  /* ===== Counter (data-count) ===== */
  gsap.utils.toArray("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: end, duration: 2, ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toLocaleString("de-DE") + suffix;
          },
        });
      },
    });
  });

  /* ===== KAPITEL 3: Ruecklende — TV-Bilder cross-fade =====
     (Sektionen tragen ihren Hintergrund selbst; kein fragiler Body-Farbwechsel.) */
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const flashback = document.querySelector("#flashback");
    if (!flashback) return;
    gsap.utils.toArray("#flashback .tv-img").forEach((img, i) => {
      gsap.fromTo(img, { opacity: i === 0 ? 1 : 0 }, {
        opacity: i === 0 ? 0 : 1, ease: "none",
        scrollTrigger: { trigger: flashback, start: "top top", end: "bottom bottom", scrub: true },
      });
    });
  });

  /* ===== KAPITEL 6: Horizontal-Scroll Galerie ===== */
  mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
    const track = document.querySelector("#gallery-track");
    if (!track) return;
    const scrollLen = track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: -scrollLen, ease: "none",
      scrollTrigger: {
        trigger: "#gallery",
        start: "top top",
        end: () => "+=" + scrollLen,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
    // Ghost-Zahl langsamer (Parallax-Differenz)
    gsap.to("#gallery .ghost-year", {
      x: -scrollLen * 0.4, ease: "none",
      scrollTrigger: { trigger: "#gallery", start: "top top", end: () => "+=" + scrollLen, scrub: 1 },
    });
  });

  /* ===== KAPITEL 7: Baum-Icons wachsen ===== */
  if (!reduceMotion) {
    gsap.utils.toArray("#offer .tree-grow").forEach((el, i) => {
      gsap.from(el, {
        scale: 0, opacity: 0, transformOrigin: "bottom center",
        duration: 0.6, ease: "back.out(1.7)", delay: i * 0.05,
        scrollTrigger: { trigger: "#offer", start: "top 70%" },
      });
    });
  }

  /* ---- Nav: Hintergrund bei Scroll ---- */
  const nav = document.querySelector("#nav");
  if (nav) {
    ScrollTrigger.create({
      start: "top -80",
      onUpdate: (self) => nav.classList.toggle("nav-scrolled", self.scroll() > 80),
    });
  }

  ScrollTrigger.refresh();
})();
