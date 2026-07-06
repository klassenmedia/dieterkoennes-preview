# DESIGN-UPGRADE: „Es wächst beim Scrollen"

> Ziel: Von „sehr gute Seite" zu „woah, wer hat DAS gebaut?" — ohne 3D-Klischees und Gradient-Overkill.
> Leitidee: Die Seite verhält sich wie Dieters Thema — **sie wächst, während man sie erlebt.** Licht wie goldene Stunde, Präzision wie Live-TV.
> Status: PLAN (noch keine Umsetzung). Stand: 06.07.2026

---

## Der Nordstern

Drei Marken-Wahrheiten übersetzen sich in drei Design-Prinzipien:

| Marke | Design-Prinzip |
|---|---|
| Er pflanzt (Wachstum) | **Die Seite wächst beim Scrollen** — ein durchgehendes, sich zeichnendes Linien-Motiv |
| Goldene Stunde (das Hero-Foto) | **Licht statt Farbverlauf** — warmes Lichtfeld, Filmkorn, Duotone-Grade |
| Live-TV (kein zweiter Take) | **Reaktive Präzision** — die Seite reagiert auf Scrollgeschwindigkeit und Cursor, alles sitzt auf den Frame |

---

## Die Elemente

### PAKET A — Signature (macht die Seite unverwechselbar)

**A1 · Die wachsende Linie** ⭐ DAS Signature-Element
Ein durchgehender SVG-Pfad („Wurzel/Ast"), der sich beim Scrollen zeichnet (`stroke-dashoffset` per ScrollTrigger-Scrub) und die ganze Startseite von Hero bis CTA durchzieht. Verzweigt sich an Kapitelgrenzen (kleine Seitentriebe zu den Headlines), treibt im ROBIN-GUT-Kapitel ein Blatt, endet am CTA-Button als kleiner Spross. Farbe: forest-mid, 1.5px Stroke, dezent — kein Comic.
- Technik: Ein `<svg>` position:absolute über die volle Dokumenthöhe, Pfad handgezeichnet (Kurven, keine Gerade), `getTotalLength()` + dashoffset-Scrub. Mobile: vereinfachter, geraderer Pfad. reduced-motion: Linie statisch voll gezeichnet.
- Aufwand: mittel–hoch | Impact: sehr hoch (kein Wettbewerber hat das)

**A2 · Digital Golden Hour (Licht-Layer)**
Statt Farbverläufen: ein warmes **Lichtfeld, das dem Cursor folgt** — großer radial-gradient (amber/soft, ~600px), `mix-blend-mode: soft-light`, lerp-gedämpft (folgt träge, wie Sonnenlicht durch Blätter). Auf Touch: langsame autonome Drift.
Dazu **Filmkorn-Overlay** über die ganze Seite: SVG-Turbulence-Noise als repeating background, opacity 0.04, `pointer-events:none` — nimmt allen Flächen die sterile Flatness, gibt Kino-Textur.
- Technik: 1 fixed div fürs Licht (transform per rAF-lerp), 1 fixed div fürs Grain (reines CSS/SVG, statisch). GPU-billig.
- Aufwand: niedrig | Impact: hoch (sofort spürbar „teuer")

**A3 · Einheitlicher Foto-Grade (Duotone/Warm)**
Alle Fotos bekommen denselben warmen Look: leichte Tonwert-Angleichung Richtung goldene Stunde (CSS `filter: sepia(0.12) saturate(1.1) contrast(1.05)` oder vorab in der Bild-Pipeline gebacken — besser: Pipeline, spart Runtime). BLOOM-Bühne, Portraits, Wald — ein Guss statt Foto-Flickenteppich.
- Aufwand: niedrig (Pipeline-Erweiterung) | Impact: mittel–hoch (Kohärenz = Premium)

**A4 · Kinetische Typografie**
- **Velocity-Marquee:** Das Sender-Band („Bekannt aus") und je Kapitel ein riesiges Outline-Ghost-Wort (WIRKUNG · HALTUNG · LIVE · WALD) driften horizontal — Grundtempo langsam, **beschleunigt mit Scrollgeschwindigkeit** und kippt die Richtung beim Hochscrollen (GSAP `ScrollTrigger.getVelocity()`).
- Ghost-Wörter: `-webkit-text-stroke` 1px, transparent gefüllt, hinter dem Content, 10rem+.
- Aufwand: mittel | Impact: hoch (das „Awwwards-Gefühl" schlechthin)

### PAKET B — Taktiler Feinschliff (macht sie hochwertig anzufassen)

**B1 · Organische Bild-Reveals**
Bilder faden nicht ein — sie **öffnen sich**: `clip-path: inset()` von einer Kante aufziehend (0.9s, expo-out), das Bild darin startet bei scale 1.15 und beruhigt sich auf 1.0 (Ken-Burns-Settle). Wichtige Bilder (BLOOM, Hero-Kids) bekommen eine leicht organische Rundung (asymmetrischer border-radius: `38% 62% 55% 45% / ...` sehr subtil) — Natur statt Rechteck-Raster.
- Aufwand: niedrig–mittel | Impact: hoch

**B2 · Magnetic CTAs + Cursor-Charakter**
Primär-Buttons ziehen den Cursor an (magnetic hover: Button folgt der Maus im Radius ~40px mit lerp, springt elastisch zurück). Eigener Cursor-Dot (klein, forest), der auf Buttons zum Ring aufblüht und auf Bildern „Ansehen" flüstert. Presse-Feedback: scale 0.97.
- Touch: entfällt automatisch. reduced-motion: aus.
- Aufwand: mittel | Impact: hoch (Interaktion fühlt sich „handgemacht" an)

**B3 · Velocity-Skew**
Bilder und Cards kippen bei schnellem Scrollen minimal (max 1.5° skewY, lerp zurück auf 0) — die Seite fühlt sich physisch an, als hätte sie Masse.
- Aufwand: niedrig | Impact: mittel–hoch

**B4 · Odometer-Zahlen**
Counter rollen wie ein Splitflap/Odometer (Ziffern-Spalten rollen einzeln aus, tabular-nums) statt simplem Hochzählen — präzise wie eine Studiouhr. Der Baum-Counter bekommt zusätzlich ein kleines Spross-Icon, das mit dem Endwert aufwächst.
- Aufwand: mittel | Impact: mittel

**B5 · Sticky-Split im Rückblende-Kapitel**
„Vom Studio in den Wald" als gepinntes Split: links bleibt die Headline stehen, rechts crossfaden 3 Bilder (Studio → Ahrtal → Pflanzung), während 3 kurze Textblöcke durchwandern. Die wachsende Linie (A1) wechselt hier sichtbar die Farbe von TV-Kalt zu Forest.
- Aufwand: mittel | Impact: hoch (erzählt den Marken-Pivot in einer Interaktion)

### PAKET C — Momente (die Details, über die man spricht)

**C1 · Samen-Moment im Offer-Kapitel**
Beim Erreichen von „Ihre Veranstaltung pflanzt Bäume": 10–15 Samen-/Blatt-Partikel segeln einmalig von oben ein (Canvas, physikalisch leicht taumelnd), landen und verschwinden. Einmal pro Session, nicht loopend — ein Moment, kein Effekt-Teppich.
- Aufwand: mittel | Impact: mittel (aber hoher Talk-Value)

**C2 · Seiten-Übergänge**
View Transitions API (Chrome/Edge/Safari-TP; Fallback: sofortiger Wechsel): beim Klick auf eine Unterseite wischt ein forest-grüner Layer von unten durch, Logo bleibt stehen. 450ms. Gibt der Multi-Page-Struktur SPA-Eleganz.
- Aufwand: niedrig–mittel | Impact: mittel–hoch

**C3 · Erst-Besuch-Moment (Preloader)**
0.8s beim allerersten Laden (sessionStorage-Gate): dunkle Fläche, die wachsende Linie zeichnet einen Spross, Fläche öffnet sich nach oben → Hero. Nie wieder in der Session.
- Aufwand: niedrig | Impact: mittel (erster Eindruck)

**C4 · Fußzeilen-Wald**
Im Footer eine flache Silhouetten-Baumreihe (SVG), die sich beim Erreichen sanft aufstellt (scale-Y stagger von 0.9→1) — der letzte Gruß der Marke.
- Aufwand: niedrig | Impact: niedrig–mittel

---

## Guardrails (nicht verhandelbar)

1. **Performance-Budget:** nur `transform`/`opacity`-Animationen, ein rAF-Loop für Lerp-Effekte (Licht, Skew, Magnetic teilen sich einen Ticker), Partikel/Canvas nur bei Sichtbarkeit aktiv, `will-change` sparsam. Lighthouse Performance bleibt ≥ 90.
2. **prefers-reduced-motion + ?nomotion:** JEDES Element hat einen statischen, vollwertigen Zustand (Linie voll gezeichnet, Zahlen stehen, kein Cursor-Custom, kein Skew). Bereits etabliertes Muster weiterführen.
3. **Mobile:** Licht-Layer driftet autonom (kein Cursor), Linie vereinfacht, Magnetic/Skew aus, Marquee läuft langsam konstant. Kein Effekt darf Scroll-Jank erzeugen.
4. **Ein Effekt pro Blickfeld:** Nie konkurrieren zwei Bewegungen um Aufmerksamkeit im selben Viewport (UX-Regel „excessive-motion"). Die Linie ist der rote Faden, alles andere ist Begleitung.
5. **CLS = 0:** Alle Layer sind fixed/absolute, nichts schiebt Layout.

## Empfohlene Reihenfolge

| Schritt | Inhalt | Warum zuerst |
|---|---|---|
| 1 | A2 Licht + Grain + A3 Foto-Grade | Niedrigster Aufwand, sofort sichtbar „high-end", Basis-Stimmung |
| 2 | A4 Kinetische Typo (Velocity-Marquee + Ghost-Wörter) | Großer Wow-Sprung, überschaubar |
| 3 | B1 Bild-Reveals + B3 Velocity-Skew | Taktiles Gefühl komplett |
| 4 | A1 Die wachsende Linie | Das Meisterstück — braucht die meiste Sorgfalt (Pfad-Design!) |
| 5 | B2 Magnetic/Cursor + B4 Odometer + B5 Sticky-Split | Interaktions-Finish |
| 6 | C1–C4 Momente | Kür, wenn 1–5 sitzen |

## Bewusst NICHT im Plan

- WebGL/Three.js-3D-Szenen (Ladezeit + Wartung, passt nicht zur Authentizitäts-Marke)
- Scroll-Jacking (Scrollrichtung kapern) — nervt Eventplaner, die schnell Infos suchen
- Video-Hintergründe im Hero (Performance, und das Kids-Foto ist stärker als jedes Stock-Video)
- Mehr Farbverläufe — Licht und Korn ersetzen sie
