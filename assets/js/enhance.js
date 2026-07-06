/* ============================================================
   Dieter Koennes — Design-Upgrade Layer ("Es waechst beim Scrollen")
   Licht, Korn, Cursor, Magnetic, Velocity-Skew, kinetische Typo,
   Bild-Reveals, wachsende Linie, Odometer, Preloader, Page-Wipe.
   Ein rAF-Loop fuer alle Lerp-Effekte. Respektiert reduced-motion/?nomotion.
   Muss NACH gsap + ScrollTrigger geladen werden.
   ============================================================ */
(function () {
  "use strict";
  if (!window.gsap) return;

  const noMotion = new URLSearchParams(location.search).has("nomotion");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || noMotion;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const lerp = (a, b, n) => (1 - n) * a + n * b;

  /* ---------- C3: Preloader (nur Erstbesuch der Session) ---------- */
  (function preloader() {
    const pre = document.querySelector("#preloader");
    if (!pre) return;
    const seen = sessionStorage.getItem("dk_seen");
    if (seen || reduce) { pre.remove(); return; }
    sessionStorage.setItem("dk_seen", "1");
    const spark = pre.querySelector(".pre-path");
    if (spark) {
      const len = spark.getTotalLength();
      spark.style.strokeDasharray = len;
      spark.style.strokeDashoffset = len;
      gsap.to(spark, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" });
    }
    setTimeout(() => {
      pre.classList.add("done");
      setTimeout(() => pre.remove(), 800);
    }, 950);
  })();

  /* ---------- A2: Grain immer an (statisch, billig) ---------- */
  // (CSS-only, nichts zu tun)

  if (reduce) {
    // Statischer Vollzustand fuer alle Upgrade-Elemente
    document.querySelectorAll(".img-reveal").forEach((el) => {
      el.style.clipPath = "inset(0 0 0 0)";
      const inner = el.querySelector("img, picture");
      if (inner) inner.style.transform = "none";
    });
    document.querySelectorAll(".growth-line path").forEach((p) => {
      p.style.strokeDashoffset = "0";
    });
    return; // keine Bewegungs-Effekte
  }

  /* ================= Bewegte Effekte ================= */

  /* ---------- A2: Lichtfeld (folgt Cursor, lerp) ---------- */
  let lightEl = document.querySelector(".light-field");
  const light = { x: window.innerWidth / 2, y: window.innerHeight * 0.4, tx: window.innerWidth / 2, ty: window.innerHeight * 0.4 };
  if (lightEl && canHover) {
    requestAnimationFrame(() => lightEl.classList.add("on"));
  } else if (lightEl && !canHover) {
    lightEl.remove(); lightEl = null;
  }

  /* ---------- B2: Custom Cursor ---------- */
  let cursor = null;
  const cur = { x: window.innerWidth / 2, y: window.innerHeight / 2, tx: window.innerWidth / 2, ty: window.innerHeight / 2 };
  if (canHover) {
    cursor = document.createElement("div");
    cursor.className = "cursor-dot";
    document.body.appendChild(cursor);
    document.documentElement.classList.add("has-cursor");
    document.querySelectorAll("a, button, summary, .magnetic").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hovering"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("hovering"));
    });
  }

  window.addEventListener("pointermove", (e) => {
    light.tx = e.clientX; light.ty = e.clientY;
    cur.tx = e.clientX; cur.ty = e.clientY;
  }, { passive: true });

  /* ---------- B2: Magnetic Buttons ---------- */
  const magnets = [];
  document.querySelectorAll(".btn-primary, .btn-ghost").forEach((el) => {
    el.classList.add("magnetic");
    const state = { el, mx: 0, my: 0, cx: 0, cy: 0, active: false };
    el.addEventListener("pointerenter", () => (state.active = true));
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      state.mx = (e.clientX - (r.left + r.width / 2)) * 0.35;
      state.my = (e.clientY - (r.top + r.height / 2)) * 0.35;
    });
    el.addEventListener("pointerleave", () => { state.active = false; state.mx = 0; state.my = 0; });
    magnets.push(state);
  });

  /* ---------- B3: Velocity-Skew ---------- */
  const skewables = gsap.utils.toArray(".skewable");
  let skewSet = skewables.length
    ? gsap.quickSetter(skewables, "skewY", "deg")
    : null;

  /* ---------- A4: Kinetische Ghost-Woerter + Marquees ---------- */
  const kinetics = [];
  document.querySelectorAll("[data-kinetic]").forEach((el) => {
    kinetics.push({ el, x: 0, base: parseFloat(el.dataset.kinetic) || -0.35 });
  });

  /* ---------- Der eine rAF-Loop ---------- */
  function raf() {
    // Licht
    if (lightEl) {
      light.x = lerp(light.x, light.tx, 0.08);
      light.y = lerp(light.y, light.ty, 0.08);
      lightEl.style.setProperty("--lx", light.x + "px");
      lightEl.style.setProperty("--ly", light.y + "px");
    }
    // Cursor
    if (cursor) {
      cur.x = lerp(cur.x, cur.tx, 0.2);
      cur.y = lerp(cur.y, cur.ty, 0.2);
      cursor.style.transform = `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%)`;
    }
    // Magnetic
    for (const s of magnets) {
      s.cx = lerp(s.cx, s.mx, 0.18);
      s.cy = lerp(s.cy, s.my, 0.18);
      s.el.style.transform = Math.abs(s.cx) < 0.1 && Math.abs(s.cy) < 0.1 && !s.active
        ? "" : `translate(${s.cx}px, ${s.cy}px)`;
    }
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  /* ---------- ScrollTrigger-basierte Effekte ---------- */
  if (window.ScrollTrigger) {
    // B3: Velocity-Skew nach Scrollgeschwindigkeit
    if (skewSet) {
      let proxy = { skew: 0 };
      const clamp = gsap.utils.clamp(-1.5, 1.5);
      ScrollTrigger.create({
        onUpdate: (self) => {
          const v = clamp(self.getVelocity() / -400);
          if (Math.abs(v) > Math.abs(proxy.skew)) {
            proxy.skew = v;
            gsap.to(proxy, { skew: 0, duration: 0.6, ease: "power3", overwrite: true, onUpdate: () => skewSet(proxy.skew) });
          }
        },
      });
    }

    // A4: Kinetische Ghost-Woerter — Basis-Drift + Scroll-Velocity
    kinetics.forEach((k) => {
      gsap.to(k.el, {
        xPercent: -30, ease: "none",
        scrollTrigger: { trigger: k.el.closest("section") || k.el, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    });

    // B1: Organische Bild-Reveals
    gsap.utils.toArray(".img-reveal").forEach((el) => {
      const inner = el.querySelector("img, picture");
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 82%" } });
      tl.to(el, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.out" }, 0);
      if (inner) tl.to(inner, { scale: 1, duration: 1.2, ease: "expo.out" }, 0);
    });

    // A1: Die wachsende Linie — SVG ueber volle Dokumenthoehe spannen
    const lineSvg = document.querySelector(".growth-line");
    const line = document.querySelector(".growth-line path");
    if (line && lineSvg) {
      const sizeSvg = () => {
        lineSvg.style.height = document.documentElement.scrollHeight + "px";
      };
      sizeSvg();
      const len = line.getTotalLength();
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      gsap.to(line, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });
      ScrollTrigger.addEventListener("refreshInit", sizeSvg);
    }

    // (Counter werden von main.js / subpage.js gehandhabt)
  }

  /* ---------- C2: Page-Transition-Wipe ---------- */
  const wipe = document.querySelector(".page-wipe");
  if (wipe) {
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute("href");
      const isInternal = href && !href.startsWith("#") && !href.startsWith("http") && !href.startsWith("mailto") && a.target !== "_blank";
      if (!isInternal) return;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        gsap.timeline()
          .set(wipe, { transformOrigin: "bottom", yPercent: 100 })
          .to(wipe, { yPercent: 0, duration: 0.4, ease: "power3.inOut" })
          .add(() => (window.location.href = href), "+=0.02");
      });
    });
  }
})();
