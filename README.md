# 🦆 Pet the Duck, Make it Quack!

A fun, silly little browser game: **pet the duck and it quacks!** Tap, click, or
drag across the duck — the more you pet, the more excited (and higher-pitched) it
gets. Rack up quacks, hit milestones, and trigger the occasional glorious
**MEGA QUACK** 🎉.

Built with **React + Vite**. Every quack is synthesized live with the Web Audio
API, so there are no sound files to load and no two quacks are exactly alike.

## 🎮 Play

Live site (GitHub Pages): **https://billmei.github.io/pet-the-duck-make-it-quack/**

## ✨ Features

- 🖐️ Pet by tapping, clicking, or dragging (works great on touchscreens)
- 🔊 Procedurally generated quacks that rise in pitch as the duck gets excited
- 💛 Happiness meter, quack counter, and a saved personal best
- 🏅 Silly milestone messages and confetti bursts
- ⌨️ Spacebar / Enter also pet the duck (accessible & keyboard-friendly)

## 🛠️ Develop

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
```

## 🚀 Deployment

Pushing to `main` triggers the GitHub Actions workflow in
`.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub
Pages. In the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.

The Vite `base` is set to `/pet-the-duck-make-it-quack/` in `vite.config.js` so
assets resolve correctly on the project Pages URL.

## 📷 Credits

Duck photo from [Unsplash](https://unsplash.com/).
