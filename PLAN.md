# PLAN: dieterkoennes.de — High-End Static Site (Tailwind + GSAP)

> Positionierung (UPDATE 06.07., User-Entscheidung): **„Der Nachhaltigkeits-Moderator. Er redet nicht über Wandel — er pflanzt ihn."**
> Nachhaltigkeit/Stiftung FÜHRT, TV-Vergangenheit ist Glaubwürdigkeits-Fundament (Rückblende, nicht Hauptrolle).
> Stack: Statisches HTML (Multi-Page) + Tailwind CSS v4 (lokaler Build) + GSAP ScrollTrigger + Lenis. Deploy: ALL-INKL (FTP/htaccess).

## Positionierung V2 (aktiv)

- **Kategorie:** Nachhaltigkeits-Moderator — Moderator & Keynote-Speaker für Nachhaltigkeit, soziale Verantwortung und Transformation. Der Einzige, der selbst eine Stiftung mit 1-Mio-Bäume-Ziel und MP-Schirmherrschaft führt.
- **Kernsatz:** „Er redet nicht über Wandel. Er pflanzt ihn."
- **Dramaturgie/Farbwelt UMGEKEHRT:** Hell/warm führt (goldene Stunde, Wald, Papier-Ton + Forest-Grün), Orange bleibt CTA-Akzent. Dunkel nur als kurze TV-Rückblende („Vom Studio in den Wald") — das Dunkle ist das Damals.
- **Bild-Erweiterung:** `002__Bilder/dieter mit kids.png` = HERO (goldene Stunde, pflanzt mit Kindern — „enkelfähig" visuell). `Olpe Pflanzgruppe.jpg` = Galerie/Wirkung. `nrw_pflanzt.jpg` (Wald-Luftaufnahme) = Textur Wirkungs-Kapitel. `dk-nrw dieter-koennes.jpg` (helles Portrait) = Über-mich. Partner-Logos aus `032_nrw-pflanzt-website-copy/*_files/`: Wald und Holz NRW, Städtetag NRW, Landkreistag NRW, Waldbauernverband, Gemeindewaldbesitzerverband, energy4climate, Städte- und Gemeindebund. Siegel/Zertifikat: `002__Bilder/Siegel NRW pflanzt.png`, `NRW pflanzt - Zertifikat Single.png`. Stiftungs-Logos: `RZ_Logo_RobinGut.svg`, `Logo-Robingut-Stiftung-*.png`.
- **SEO-Keywords V2:** Nachhaltigkeitsmoderator, Moderator Nachhaltigkeit buchen, Keynote Speaker Nachhaltigkeit, Moderator CSR/Energiewende/Transformation, Nachhaltigkeitsevent NRW (Blue Ocean auch im Suchmarkt — „Eventmoderator NRW" bleibt sekundär auf /moderation/).
- **BUCHBARKEIT IM VORDERGRUND (User, 06.07.):** Er will als Nachhaltigkeitsmoderator & Speaker GEBUCHT werden — jede Sektion endet auf Buchungs-CTA, Hero-Badge = „Jetzt buchbar", Primär-CTA = „Als Moderator & Speaker anfragen". Stiftung ist der Beweis, nicht das Produkt.
- **Referenz BLOOM (echte Bühnen-Fotos, IMG_0527/0521 HEIC → `bloom-stage-*.webp`, `bloom-hoch-*.webp`):** Dieter live beim **BLOOM Zukunftsforum Mönchengladbach für Umwelt, Wandel und Visionen** — erste namentliche Referenz als Nachhaltigkeits-Speaker. Einsatz: Kapitel 4 (Bühnen-Proof) + Referenzen-Sektion; Alt-Texte mit „Nachhaltigkeitsmoderator" + Eventname (SEO).

---

## Phase 0 — Faktenbasis (ERLEDIGT, hier dokumentiert)

**Content-Quelle:** `~/Downloads/018__PRUEFEN/dieterkoennes-v4.html` — beste Copy & komplettes Schema.org-Markup (Person, 3× Service, FAQPage, Organization, BreadcrumbList, Speakable). Copy-Fragmente übernehmen: „Er kennt beide Seiten der Kamera", „Investigativer Instinkt. Auf Ihrer Bühne.", „Kein zweiter Take. Keine Ausrede.", „Drei Formate. Eine Qualität.", „Vom Niederrhein in die Prime Time.", Timeline 2007–2026, 5 FAQ-Blöcke, Formular (Name/E-Mail/Buchungstyp/Nachricht/E-Mail-oder-WhatsApp/DSGVO-Checkbox).

**Assets:**
- `~/Downloads/043_Website-Assets/`: dieter-portrait-professional.jpg, dieter-moderation-event.jpg, dieter-event-netzwerk.jpg, dieter-startup-fryzza.jpg, dieter-koennes-logo.png, robin-gut-logo.svg/png
- `~/Downloads/060_Website-Bilder/`: dieter-rtl-studio.jpg, dieter-portrait.jpg, dieter-moderation.jpg, dieter-event.jpg
- `~/Downloads/034_Bilder Dieter/`: Event-Fotos (teils HEIC → konvertieren), u.a. „IHK Wahlarena Neuss"
- Hero-Bild live: `https://dieterkoennes.de/wp-content/uploads/dieter-koennes-header-black.jpg` (herunterladen)

**Fakten für Counter/Statistiken (aus v4):** 25+ Jahre TV & Radio, 1.000+ Livemoderationen, Podiumsdiskussionen/Speaker/Events, Coachings & Medientrainings; ROBIN GUT: 20.000+ Bäume, Ziel 1 Million, Schirmherr MP Hendrik Wüst, Auftakt NRW pflanzt 2026.

**Erlaubte Libraries (gepinnt, per CDN mit lokalem Fallback):**
- GSAP 3.13.x: `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js` + `.../ScrollTrigger.min.js`
- Lenis 1.x: `https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js`
- Tailwind CSS v4 via npm (`npx @tailwindcss/cli -i src/input.css -o assets/css/main.css --minify`), kein CDN-Tailwind in Produktion.

**Erlaubte API-Patterns (NICHT davon abweichen):**
```js
gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
gsap.timeline({ scrollTrigger: { trigger, start: 'top top', end: '+=100%', scrub: 1, pin: true }});
gsap.to(el, { xPercent: -100, scrollTrigger: { scrub: true }});
gsap.from(el, { y: 40, opacity: 0, stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 80%' }});
```
**Anti-Patterns (VERBOTEN):** SplitText/ScrollSmoother-Plugins (nicht einbinden — Wort-Reveals manuell: Wörter serverseitig in `<span class="word">` wrappen); kein jQuery; keine erfundenen Lenis-Optionen (nur `new Lenis()` bzw. dokumentierte `{ lerp, duration }`); kein `tailwind.config.js` (v4 nutzt `@theme` in CSS).

---

## Phase 1 — Projekt-Setup

Ort: `/Users/klassenmedia/dieterkoennes-website/`

```
├── index.html, moderation/, keynote/, coaching/, robin-gut/, kontakt/, impressum/, datenschutz/  (je index.html)
├── src/input.css               (Tailwind v4 + @theme Tokens)
├── assets/css/main.css         (Build-Output)
├── assets/js/{gsap.min.js, ScrollTrigger.min.js, lenis.min.js, main.js}
├── assets/img/ , assets/video/
├── kontakt/send.php            (PHP-Mailer, Honeypot, Validierung)
├── robots.txt, llms.txt, sitemap.xml, .htaccess
└── package.json (nur devDep: @tailwindcss/cli)
```

Design-Tokens in `@theme`: `--color-brand: #f76625; --color-brand-dark: #c44e17; --color-ink: #0e0e10; --color-forest: #14532d; --color-forest-light: #16a34a; --font-display: "Poppins"; --font-body: "Inter"`. Dunkler Grundton (`#0e0e10`) als Default, Hell nur im ROBIN-GUT-Kapitel.

**Verifikation:** `npx @tailwindcss/cli` Build läuft fehlerfrei; `index.html` öffnet mit dunklem BG + Fonts.

## Phase 2 — Bild-Pipeline

1. Alle Assets nach `assets/img/src-original/` kopieren; HEIC → JPG via `sips -s format jpeg`.
2. WebP-Ableitungen in 3 Größen (480/1024/1920) via `sips`/`cwebp` oder ffmpeg; Hero zusätzlich AVIF.
3. Naming: `hero-dark-1920.webp`, `portrait-*.webp`, `timeline-*.webp`, `robin-gut-*.webp`.

**Verifikation:** Kein Bild > 250 KB (Hero ≤ 400 KB); `ls -la assets/img`.

## Phase 3 — index.html: die Scroll-Story (8 Kapitel)

**V2-Dramaturgie: Hell (Wald, heute) → Dunkel (TV-Studio, Rückblende) → Hell (Wirkung, Zukunft).**

> **STATUS Phase 3: FERTIG & im Browser verifiziert (06.07.).** Alle 8 Kapitel gebaut, GSAP+Lenis lokal, Counter/Parallax/Horizontal-Galerie/Baum-Icons laufen, BLOOM-Proof drin. Gefixte Bugs: (1) Hero-Freeze im reduced-motion-Pfad, (2) `overflow-x:hidden` machte Body zum Scroll-Container → `clip`, (3) helle Sektionen tragen jetzt eigenen Hintergrund statt vom Body-Farbwechsel abzuhängen, (4) Partner-Logos in weiße Cards. `?nomotion`-URL-Param = statischer Testmodus. OFFEN für Feinschliff: Galerie-Bild 2 (GGS-Logo → besseres Aktionsfoto), Siegel-PNG (transparente Textbereiche → echtes Zertifikat), Rückblende-Kapitel könnte optional wieder dunklen Scroll-Farbwechsel bekommen.

| # | Kapitel | Inhalt | Design | Animation |
|---|---|---|---|---|
| 1 | **Hero** | H1 „Er redet nicht über Wandel. Er pflanzt ihn." + Sub „Moderator & Keynote-Speaker für Nachhaltigkeit. Gründer der ROBIN GUT Stiftung. 25 Jahre TV-Erfahrung." + 2 CTAs + Badge | Fullscreen `dieter mit kids` (goldene Stunde), warmes Overlay, helle Typo | 3 Parallax-Ebenen, Wort-für-Wort-Reveal, Badge-Pulse |
| 2 | **Wirkung in Zahlen** | Baum-Counter 20.000+ → Ziel 1.000.000, Schulen & Kitas, Schirmherr MP Wüst; **Partner-Logo-Band** (Wald und Holz NRW, Städtetag, Landkreistag, Waldbauernverband, energy4climate…) | Heller Papier-Ton, Forest-Grün-Akzente, Wald-Luftaufnahme als Parallax-Textur | Counter-Tween (`snap:1`), Logos staggered fade-in, BG-Bild langsamer als Content |
| 3 | **Vom Studio in den Wald** | Rückblende: 25 Jahre WDR/RTL (Servicezeit, Könnes kämpft, stern TV) → Wendepunkt Ahrtal 2021 → Gründung Stiftung. Sender-Marquee klein integriert. | **Scroll-Farbwechsel ins Dunkle** (TV-Studio-Bild), dann zurück ins Helle — das Dunkle ist das Damals | `gsap.to(body,{backgroundColor})` scrub; Pinned Text, TV-Bilder cross-faden; Marquee CSS |
| 4 | **Warum das Ihr Event verändert** | „Podien zu Klima, CSR und Transformation moderiert hier jemand, der selbst eine Stiftung führt. Keine angelesenen Moderationskarten — gelebtes Thema. Und: TV-geschult, live-sicher, kein zweiter Take." | 2 Feature-Blöcke (Haltung + Handwerk) | Staggered Reveals, leichtes Parallax auf Bildern |
| 5 | **Drei Formate** | (1) **Nachhaltigkeits-Moderation** — CSR-Kongresse, Energie-Podien, Fachtagungen; (2) **Keynote „Enkelfähig"** — Nachhaltigkeit, Verantwortung, Kommunikation; (3) **Coaching & Medientraining** — Führungskräfte | 3 Glass-Cards (helle Variante), Hover-Tilt | Staggered `y:60→0`, Hover-Glow forest |
| 6 | **NRW pflanzt live** | Galerie: Olpe Pflanzgruppe, GGS Waldniel (Umweltbildung), weitere Aktionsbilder; „Gemeinsam mit Schulen, Kommunen und Unternehmen" | Horizontal-Scroll-Galerie mit Ghost-Text „1.000.000" | Container pinned, `xPercent`-Scrub; Ghost-Zahl Parallax |
| 7 | **Ihre Veranstaltung pflanzt Bäume** | Das Offer: Buchung → Bäume, mit **Siegel NRW pflanzt** + Zertifikat-Visual + Wüst-Badge + Link robin-gut.org (Mechanik-Details nach Freigabe Dieter) | Forest-Grün-Block, Zertifikat als Karte | Baum-Icons wachsen (scale 0→1 stagger), Counter |
| 8 | **FAQ + CTA + Footer** | 5 FAQs (V2-Wording, native `<details>`) + „Bereit für ein Event mit Wirkung?" → /kontakt/ | Warm-hell, großer CTA-Block | Sanfte Reveals, CTA-Glow |

**Verifikation:** Preview im Browser — alle 8 Kapitel scrollen flüssig, Pin-Sections springen nicht (`markers: true` beim Entwickeln, danach entfernen), `prefers-reduced-motion: reduce` → alle Tweens via `gsap.matchMedia()` deaktiviert, Inhalt voll sichtbar.

## Phase 4 — Unterseiten (Landingpages)

Gemeinsames Muster: Answer-First-Absatz direkt unter H1 (zitierfähig für LLMs), dann Nutzen-Sektion, Bild, 3–4 seiten-spezifische FAQs, CTA. Nur leichte Reveals — kein Pinning (schnell + fokussiert auf Conversion).

- **/moderation/** — H1 „Eventmoderator für NRW & deutschlandweit". Keywords: Eventmoderator NRW, Moderator buchen Düsseldorf/Köln/Dortmund. Formate-Liste aus v4-FAQ.
- **/keynote/** — H1 „Keynote-Redner: Klartext aus 25 Jahren Journalismus". Themen: Nachhaltigkeit/„enkelfähig", Kommunikation, investigativer Blick.
- **/coaching/** — H1 „Medientraining & Kommunikations-Coaching für Führungskräfte". Kamera-Training, Krisenkommunikation.
- **/robin-gut/** — Stiftungs-Story lang, Baum-Counter, „Buchung pflanzt"-Mechanik (Details nach Freigabe Dieter), Bildergalerie NRW pflanzt.
- **/kontakt/** — Formular aus v4 (inkl. E-Mail/WhatsApp-Wahl) + `send.php`: POST-Validierung, Honeypot-Feld, `mail()` an info@dieter-koennes.de, Redirect auf Danke-Anker.
- **/impressum/ + /datenschutz/** — Inhalte aus v4-Modal übernehmen (Verantwortlicher: Dieter Könnes, Viersen).

**Verifikation:** Jede Seite hat genau 1 H1, Answer-First-Absatz, eigene title/description; Formular-Test lokal (PHP via `php -S`).

## Phase 5 — SEO/GEO/LLM-Layer

1. **Schema.org:** v4-JSON-LD übernehmen und aufteilen — Person+WebSite+Organization global; Service+FAQPage je Unterseite; VideoObject falls Showreel kommt. BreadcrumbList pro Unterseite.
2. **robots.txt:** GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Bingbot, Googlebot explizit `Allow: /` + Sitemap-Zeile.
3. **llms.txt:** Markdown-Steckbrief (wer/was/Zahlen/Formate/Kontakt/Links auf alle Unterseiten).
4. **Meta:** title ≤ 60 Zeichen mit Primär-Keyword, description 150–160, OG + Twitter-Card je Seite (og:image 1200×630 aus Portrait bauen). KEINE meta-keywords (v4-Liste fliegt raus).
5. **sitemap.xml** mit allen 8 URLs, lastmod aktuell.
6. **.htaccess:** 301-Redirects alter WP-URLs (vor Deploy Live-URLs crawlen: `curl -s https://dieterkoennes.de/sitemap.xml`), Caching-Header (immutable für /assets/), **ALL-INKL-Kompressions-Fix** (`RequestHeader unset Accept-Encoding` nur falls Zeichensalat-Bug auftritt — bekanntes Verhalten), Security-Header (X-Content-Type-Options, Referrer-Policy).
7. **GEO-Content-Check:** Jede Seite ≥ 3 konkrete Zahlen, ≥ 1 Zitat mit Attribution, kurze Absätze, Fakten-Tabelle wo sinnvoll.

**Verifikation:** `python3` Schema-Lint (JSON parsen), Rich-Results-Test nach Deploy, `curl robots.txt/llms.txt/sitemap.xml` liefern 200.

## Phase 6 — QA & Performance

1. Lighthouse (Preview-Server): Performance ≥ 95, SEO = 100, A11y ≥ 95.
2. Mobile 375px: Timeline-Kapitel fällt auf vertikale Cards zurück (`gsap.matchMedia('(min-width: 768px)')` fürs Pinning).
3. Reduced-Motion-Test, Tastatur-Navigation, Formular-Fehlerpfade.
4. Cross-Check: alle internen Links, 404-Test.

## Phase 7 — Deploy ALL-INKL

1. **OFFEN (User fragen):** FTP/SSH-Zugang KAS, Zielverzeichnis. Strategie: erst nach `/neu/` oder Subdomain hochladen → Freigabe Dieter → DocumentRoot-Switch/Umzug → 301-Redirects aktiv → WordPress-Verzeichnis als Backup behalten (nicht löschen).
2. Nach Go-Live: Search Console + **Bing Webmaster Tools** Sitemap einreichen, Brave-Index prüfen, Rich-Results-Test, nach 2–4 Wochen LLM-Zitat-Check („Wer ist Dieter Könnes?" an ChatGPT/Perplexity).

---

## Offene Entscheidungen (blockieren nur Phase 7 bzw. einzelne Texte)
1. **Hero-Headline** „Er kämpft. Live. Ohne zweiten Take." — Freigabe Dieter (Fallback vorhanden)
2. **Baum-Mechanik** (Bäume pro Buchung, Abwicklung) — Freigabe Dieter
3. **WhatsApp-Nummer** fürs Formular
4. **ALL-INKL-Zugang** für Deploy
