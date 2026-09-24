# Design System — Mahreen PathFinder

> Adaptasi dari style reference "deep-ocean bioluminescent terminal". Kegelapan bertekanan tempat karya terlihat lahir sebagai aliran ASCII, dan kontrol muncul sebagai spesimen yang berpendar samar.

**Theme:** dark
**Brand:** Mahreen Indonesia — "BERKARYA UNTUK INDONESIA"

## Direction

Interface terasa seperti mengintip lewat porthole laut dalam: void bioluminescent dengan sumber cahaya samar. Background #06051d ber-undertone violet memberi kedalaman kosmik, bukan hitam datar. Hero diisi animasi teks ASCII/generatif yang menyusun kata-kata tema (BERKARYA, KREATIVITAS, TEKNOLOGI, KOMUNITAS, DAMPAK) sehingga terasa "kecerdasan sedang dihasilkan real-time". Seluruh navigasi, heading, tombol, dan body memakai JetBrains Mono — monospace sebagai identitas visual, membuat setiap label terasa seperti perintah terminal. Tombol pill translucent (hijau/amber/merah @20% opacity) berfungsi sebagai "paket data terkategorisasi", bukan CTA konvensional.

## Tokens — Colors

| Name                 | Value                                                  | Token                          | Role                                      |
| -------------------- | ------------------------------------------------------ | ------------------------------ | ----------------------------------------- |
| Cosmic Void          | `linear-gradient(0deg, rgb(6,5,29) 30%, rgb(6,20,52))` | `--color-cosmic-void`          | Background halaman & hero                 |
| Abyssal Blue         | `#0f1c36`                                              | `--color-abyssal-blue`         | Background input/select, surface sekunder |
| Steel Navy           | `#1d293d`                                              | `--color-steel-navy`           | Navbar, ProgramCard                       |
| Deep Slate           | `#314062`                                              | `--color-deep-slate`           | Hover state, ResultCard                   |
| Mist                 | `#cad5e2`                                              | `--color-mist`                 | Body text utama                           |
| Fog                  | `#e5e7eb`                                              | `--color-fog`                  | Border, divider                           |
| Ash                  | `#2e3038`                                              | `--color-ash`                  | Text sekunder, label redup                |
| Ghost White          | `#ffffff`                                              | `--color-ghost-white`          | Heading, judul card                       |
| Ice Blue             | `#ebf8ff`                                              | `--color-ice-blue`             | Text brightness tinggi di surface gelap   |
| Portal Blue          | `#63b3ed`                                              | `--color-portal-blue`          | Inline link, flat nav link, focus state   |
| Bioluminescent Green | `#004f3b`                                              | `--color-bioluminescent-green` | Pill "Daftar" & submit quiz (20% opacity) |
| Terminal Amber       | `#733e0a`                                              | `--color-terminal-amber`       | Pill "Mulai Quiz" (20% opacity)           |
| Crimson Depth        | `#8b0836`                                              | `--color-crimson-depth`        | Pill "Masuk" (20% opacity)                |
| Specimen Green       | `#00bc7d`                                              | `--color-specimen-green`       | Text pill hijau, kategori program, skor   |
| Warning Amber        | `#f0b100`                                              | `--color-warning-amber`        | Ikon section heading                      |
| Fault Red            | `#ff2056`                                              | `--color-fault-red`            | Error text & state                        |

## Tokens — Typography

- **JetBrains Mono** (`--font-jetbrains-mono`): SEMUA role tipografi — nav, heading, body, tombol, link. Substitute: Fira Code, Source Code Pro. Weights: 400 (maks 500).
- **DM Sans** (`--font-dm-sans`): hanya prose/deskripsi panjang (deskripsi program, paragraf tentang). 16px, weight 400/500. Substitute: Inter, Outfit.

| Role    | Size | Line Height | Token            |
| ------- | ---- | ----------- | ---------------- |
| caption | 14px | 1.63        | `--text-caption` |
| body    | 16px | 1.5         | `--text-body`    |
| heading | 30px | 1.25        | `--text-heading` |

## Tokens — Spacing & Shapes

Base unit 8px. Scale: 8 / 16 / 24 / 32 / 48 / 64.
Radius: cards 8px, images 8px, inputs 8px, buttons 9999px.
Shadow: hanya untuk pill button — `rgba(0,0,0,0.1) 0px 4px 6px -1px, rgba(0,0,0,0.1) 0px 2px 4px -2px`. Card TIDAK pakai shadow.
Layout: page max-width 800px; section gap 64px; card padding 32px; element gap 8–16px.

## Surfaces

| Level | Name               | Value     | Purpose                 |
| ----- | ------------------ | --------- | ----------------------- |
| 0     | Cosmic Void        | `#06051d` | Base page               |
| 1     | Deep Navy Gradient | `#061434` | Terminus gradient hero  |
| 2     | Abyssal Blue       | `#0f1c36` | Input, surface sekunder |
| 3     | Steel Navy         | `#1d293d` | Navbar, ProgramCard     |
| 4     | Deep Slate         | `#314062` | Hover, ResultCard       |

Elevasi dinyatakan lewat langkah warna surface, bukan shadow.

## Components

### StickyNavBar

Full-width, background Steel Navy, padding vertikal 8px, horizontal 48px. Kiri: logo-text `mahreen://pathfinder` (14px mono, ghost white) + flat link "program" & "tentang" (Portal Blue, 16px, tanpa chrome). Kanan: pill triad — Daftar (hijau), Masuk (merah), Mulai Quiz (amber). Saat login: triad diganti caption email (mist) + flat link "keluar" (Portal Blue).

### HeroASCII

Full-viewport, background gradient Cosmic Void. Animasi ASCII density tinggi warna Mist @~5% opacity membentuk massa spherical dari kata tema. Overlay judul "BERKARYA UNTUK INDONESIA" 36–40px JetBrains Mono 400 Ghost White, center. Sub-caption 14px Mist. Tiga pill triad di bawah hero, gap 16px.

### SectionHeading

Ikon amber 16px (#f0b100) + label 30px JetBrains Mono 400 Ghost White, gap 8px, left-aligned. Set ikon: `⚙ program`, `ℹ tentang`, `▶ quiz`, `★ hasil`. Tanpa bold, tanpa uppercase, tanpa letter-spacing override.

### ProgramCard

Surface Steel Navy, radius 8px, padding 32px. Judul 16px Ghost White. Kategori caption 14px Specimen Green. Deskripsi DM Sans 16px Mist. Tags caption 14px mono Portal Blue dipisah " · ". CTA inline link Portal Blue "ikut program →". Hover: surface Deep Slate. Grid: 2 kolom desktop (gap 16px), 1 kolom mobile.

### QuizForm

Label caption mono Mist. Input/select: background Abyssal Blue, border Fog 15%, radius 8px, padding 8px 16px, text Mist mono 16px. Focus: border Portal Blue. Error: caption Fault Red di bawah field. Submit: pill hijau.

### ResultCard

Surface Deep Slate, radius 8px, padding 32px. Judul program 16px Ghost White. Skor caption Specimen Green ("skor kecocokan: NN"). Deskripsi DM Sans Mist. CTA inline Portal Blue.

### AuthCard

Kolom max 640px. Input sama dengan QuizForm. Submit pill hijau. Toggle mode = flat link Portal Blue. Pesan error caption Fault Red.

### InlineBodyLink

16px mono 400 Portal Blue, tanpa underline default. Satu-satunya warna kromatik di body prose.

## States

- Hover: surface naik satu level (Steel Navy → Deep Slate).
- Focus: outline/border Portal Blue 2px, offset 2px.
- Disabled/loading: opacity 50%, label tombol "memproses...".
- Error: text Fault Red caption; input border Fault Red.
- Empty: caption Mist "belum ada data".

## Responsive

- Mobile < 640px: nav pill wrap ke baris kedua; hero title 28px; grid 1 kolom.
- Tablet 640–1024px: grid 2 kolom.
- Desktop > 1024px: page column 800px center.

## Accessibility

Kontras Mist/Cosmic Void terjaga; focus state selalu visible; elemen semantik (nav/main/section/label); seluruh flow quiz & auth bisa via keyboard.

## Do's and Don'ts

### Do

- JetBrains Mono sebagai typeface utama semua UI.
- Pill triad hijau/amber/merah @20% opacity HANYA untuk triad nav/submit utama.
- Background hanya #06051d atau gradient-nya; jangan pernah #000000 murni.
- Radius 9999px untuk pill, 8px untuk card/input; tanpa nilai tengah.
- Heading 30px mono weight 400 dengan ikon amber; tidak shouty.
- Portal Blue eksklusif untuk link.
- Section gap 64px untuk atmosfer void.
- Seluruh copy UI Bahasa Indonesia yang santai tapi sopan untuk generasi muda.

### Don't

- Jangan pakai sans/serif untuk heading; DM Sans hanya prose.
- Jangan buat button solid opaque; sistemnya tint translucent 20%.
- Jangan引入 light background; tidak ada light mode.
- Jangan menambah warna pill keempat.
- Jangan bold heading atau weight > 500.
- Jangan tambah foto/ilustrasi tradisional; visual hanya ASCII hero dan glyph ikon.
- Jangan beri background berwarna pada blok prose; prose duduk langsung di Cosmic Void.

## Quick Start (Tailwind v4)

```css
@theme {
  --color-cosmic-void: #06051d;
  --color-abyssal-blue: #0f1c36;
  --color-steel-navy: #1d293d;
  --color-deep-slate: #314062;
  --color-mist: #cad5e2;
  --color-fog: #e5e7eb;
  --color-ash: #2e3038;
  --color-ghost-white: #ffffff;
  --color-ice-blue: #ebf8ff;
  --color-portal-blue: #63b3ed;
  --color-bioluminescent-green: #004f3b;
  --color-terminal-amber: #733e0a;
  --color-crimson-depth: #8b0836;
  --color-specimen-green: #00bc7d;
  --color-warning-amber: #f0b100;
  --color-fault-red: #ff2056;
  --font-jetbrains-mono:
    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --font-dm-sans: "DM Sans", ui-sans-serif, system-ui, sans-serif;
  --text-caption: 14px;
  --text-body: 16px;
  --text-heading: 30px;
  --radius-lg: 8px;
  --radius-full: 9999px;
}
```
