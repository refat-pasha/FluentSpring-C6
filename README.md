# FluentSpring C6 — First Hello

A browser-run English lesson for **C6: Introducing Yourself and Others**, set at a university club fair in Dhaka. The main activity is a **15-minute role-play practice** in four timed rounds.

## Live site

<https://refat-pasha.github.io/FluentSpring-C6/>

## The lesson

| Time | Stage | What learners do |
| --- | --- | --- |
| 2 min | 1 · Warm-up | Choose a welcoming opener for a student alone at the fair |
| 2 min | 2 · Delivery | Notice the four moves: open, connect, introduce, invite |
| 6 min | 3 · Guided practice | Role-play rounds 1–2, with criteria, starters and a model line |
| 9 min | 4 · Main task | Role-play rounds 3–4: introduce Rafi, invite Nila, close warmly |
| 1 min | 5 · Review | Three quick decisions about the conversation, with reasons |
| 2 min | 6 · Feedback | Role-play report plus the exit-ticket score and next steps |

The website shows all six stages: a framework strip, a six-step route in the sidebar, stage labels on every panel, and a highlighted stage chip inside the role-play timer.

### The role-play

Learners choose a role card and a character name, then play four rounds against a 15:00 countdown:

1. **First contact (0:00–3:30)** — greet Nila, give your name, answer her question.
2. **Find common ground (3:30–7:30)** — share a detail and ask a question back.
3. **Bring a friend in (7:30–11:30)** — introduce Rafi to Nila and Nila to Rafi.
4. **Invite and close (11:30–15:00)** — invite Nila to the first meeting and close warmly.

Each round shows its three criteria *before* the learner writes, Nila and Rafi answer in dialogue, and the line is scored immediately with a specific fix for anything missed. The role-play ends with a **12-point report** containing each round's score, the learner's own words, and two next steps. The transcript can be copied. The timer can be paused.

## Run locally

Open `index.html` directly, or:

```sh
node server.js
```

Then browse to <http://127.0.0.1:4173>.

## Project files

- `index.html` — lesson page.
- `lesson.css` — responsive, large-type styles including the role-play studio.
- `lesson.ts` — TypeScript source for the role-play engine, scoring and feedback.
- `lesson.js` — compiled browser script loaded by the site.
- `lesson-test.js` — role-play flow tests (`node lesson-test.js`).
- `web-test.js` — page/asset/structure checks (`node web-test.js`).
- `server.js` — optional dependency-free local static server.

Rebuild the browser script after editing `lesson.ts`:

```sh
npx --yes --package typescript tsc lesson.ts --target ES2020 --lib DOM,ES2020 --strict --module ES2020 --outDir .
```

## Responsible use

Scoring is rule-based and runs entirely in the browser: no external AI model, no upload, no stored learner data. Optional text-to-speech uses voices installed in the learner's browser/device, so voice quality varies and speech is never required to complete the practice.
