# Tianding Hou — Personal Website

A bilingual, responsive portfolio for AI applications, software engineering, and robot learning. Plain HTML, CSS, and JavaScript; no build step or dependencies.

## Preview

From this directory:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/. Publishing follows the repository's GitHub Pages configuration.

## Content

- Research: **React When You Need To**, with its [arXiv preprint](https://arxiv.org/abs/2609.22587), [project website](https://react-when-you-need-to.github.io/), supplementary video, and method figure.
- Existing projects: Moodtrip (including the full 05:46 project video), IV-SLAM Seminar, Secure Memory Unit, and Personal Portfolio Website. IV-SLAM is listed before SMU.
- Skills distinguish project experience from current learning interests.
- The Moodtrip preview starts with a scripted conversation: choose one of four preset mood messages, confirm the suggested outing, then explore the existing route demo. Start over resets the conversation. Switching language preserves progress. It uses predefined local replies and routes; it does not call an LLM or the original backend.
- Moodtrip’s full project recording is stored locally at `videos/moodtrip-full-demo.mp4`, with a poster extracted from the recording.
- Research video streams from the project website. Its availability depends on that host. Posters and the method figure are local files.

## Editing

Text translations live in `data-en` and `data-zh` attributes in `index.html`; Moodtrip route translations live in `script.js`. CSS tokens are at the top of `styles.css`. The initial English content is readable without JavaScript.

The visual direction draws on the restrained academic structure of [al-folio](https://alshedivat.github.io/al-folio/), [Academic Pages](https://academicpages.github.io/), and [Hugo Website / PaperMod](https://pascalmichaillat.org/hugo-website/). The implementation uses the existing static site rather than importing a template or build system.

## Verification of this revision

Checked in the Codex in-app browser at desktop (1440 × 900), mobile (390 × 844), and the concept image dimensions (992 × 1586). Desktop and mobile have no horizontal overflow. Verified English/Chinese switching, Moodtrip route changes, mobile menu opening and closing on navigation, the expandable method figure, and actual supplementary-video playback (178.3 seconds total). JavaScript syntax, local image paths, anchor targets, unique IDs, translations, and preservation of all four earlier projects passed static checks.

The design concept and rendered screenshots were inspected for typography, white/forest-green palette, open two-column composition, ruled project/skill rows, spacing, media framing, and mobile stacking. Intentional changes from the generated concept: real portrait and robot footage; verified paper authors and arXiv status; original project descriptions and full Moodtrip interaction; the existing education/contact history; learning interests explicitly separated from experience. The English hero copy matches the concept; Education navigation and a portrait caption were retained as useful additions. The concept's invented skills, project claims, and education dates were not used.

This verifies the local revision; it does not verify a production deployment. Master's enrollment wording follows the previously reviewed WS 2026/27 enrollment evidence, without a new account check in this revision.

## Moodtrip conversation checks

Run `node tests/moodtrip.test.cjs`. The dependency-free test covers all four moods in English and Chinese, confirmation before showing a route, route durations, reset, repeated rendering, and language changes without losing progress.
