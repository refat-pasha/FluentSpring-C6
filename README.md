# FluentSpring C6 — First Hello

A browser-run 15-minute English lesson for C6: **Introducing Yourself and Others**, set at a Bangladeshi university campus club fair. The core lesson includes a warm-up, phrase toolkit, guided dialogue, friend-introduction role-play, and exit ticket. Optional practice transfers the language to a library group or cultural evening.

## Live site

After GitHub Pages deployment, visit the URL shown in the repository's **Settings → Pages**. The usual project-site format is `https://<account>.github.io/FluentSpring-C6/`.

## Run locally

Open `index.html` directly, or use Node.js:

```sh
node server.js
```

Then browse to <http://127.0.0.1:4173>.

## Project files

- `index.html` — full interactive lesson.
- `lesson.css` — responsive, large-type presentation styles.
- `lesson.ts` — TypeScript source for all lesson interactions and local formative feedback.
- `lesson.js` — compiled browser script loaded by the site.
- `lesson-test.js` — browser-independent interaction smoke checks (`node lesson-test.js`).
- `server.js` — optional local static server.

The lesson does not call an external AI model, and it does not upload or save learner answers. Formative suggestions are generated locally from transparent rules. Optional text-to-speech depends on voices installed in the learner’s browser/device.
