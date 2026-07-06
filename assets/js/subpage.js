/* ============================================================
   Dieter Koennes — Unterseiten Motion Layer (leichtgewichtig)
   Lenis Smooth Scroll + sanfte Scroll-Reveals. Kein Pinning.
   ============================================================ */
(function () {
  "use strict";
  gsap.registerPlugin(ScrollTrigger);

  const noMotion = new URLSearchParams(location.search).has("nomotion");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || noMotion;

  if (!reduceMotion) {
    document.documentElement.classList.add("lenis");
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Counter (data-count) — mit statischem Fallback fuer reduced-motion
  gsap.utils.toArray("[data-count]").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) {
      el.textContent = Math.round(end).toLocaleString("de-DE") + suffix;
      return;
    }
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => gsap.to(obj, {
        v: end, duration: 2, ease: "power2.out",
        onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString("de-DE") + suffix; },
      }),
    });
  });

  if (reduceMotion) {
    gsap.set(".reveal", { opacity: 1, y: 0 });
    gsap.set(".hero-fade", { opacity: 1, y: 0 });
  } else {
    // Hero-Elemente beim Laden sanft einblenden
    gsap.from(".hero-fade", {
      y: 24, opacity: 0, duration: 0.9, ease: "power3.out",
      stagger: 0.12, delay: 0.15,
    });
    // Hero-Bild dezenter Ken-Burns / Parallax
    gsap.to(".subhero-bg", {
      scale: 1.08, ease: "none",
      scrollTrigger: { trigger: ".subhero", start: "top top", end: "bottom top", scrub: true },
    });
    // Generische Reveals
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });
  }

  ScrollTrigger.refresh();
})();
