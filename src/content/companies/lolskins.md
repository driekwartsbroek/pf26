---
name: lolskins.io
role: Designer and builder
start: 2026-09
side: true
order: 7
accent: "#5b3fa8"
kind: design
prototypesPlacement: top
prototypes:
  - title: Thresh's champion page on lolskins.io
    caption: The real page, live. Scroll it, and watch the art breathe.
    url: https://lolskins.io/champion/Thresh/
    device: desktop
    width: 1440
shots:
  - video: ./video/lolskins-headers.mp4
    image: ./shots/lolskins-headers-poster.jpg
    caption: Champion headers, with a depth parallax that moves the art in 3D
    span: wide
  - image: ./shots/lolskins-depth-ornn.png
    caption: How it moves, every splash gets a depth map at build time and a shader shifts near and far apart
  - link: https://lolskins.io/
    image: ./shots/lolskins-home.webp
    caption: lolskins.io, live
    text: Every League of Legends skin with its rarity, price, splash art and 3D model.
  - image: ./shots/lolskins-skin.webp
    caption: Skin page, with the rarity tier and the price right under the name
    span: wide
  - stack:
      - ./shots/lolskins-m-skin.webp
      - ./shots/lolskins-m-home.webp
      - ./shots/lolskins-m-days.webp
    caption: On a phone, where most players look it up
    span: tall
  - image: ./shots/lolskins-skin-details.webp
    caption: What it's worth, from shard values to loot and store status
  - image: ./shots/lolskins-bracket.webp
    caption: Skin bracket, the tree fills in as you pick and becomes the share card
    span: wide
  - image: ./shots/lolskins-days-since.webp
    caption: Days since each champion's last skin
  - stack:
      - ./shots/lolskins-home.webp
      - ./shots/lolskins-rarest.webp
    caption: Home and the rarest skins in the game
did:
  - title: Start from the search
    text: After a Hextech chest or a reroll, players google whether their new skin is rare. Page titles, FAQs and five guides are written around that question.
  - title: One answer per skin
    text: A tier from Common to Unobtainable, the price in RP and orange essence, and whether to keep or disenchant it.
  - title: Reasons to come back
    text: Days since each champion's last skin, upcoming PBE skins, a Worlds vote, and brackets and tier lists that export share cards.
  - title: Depth from a flat painting
    text: Each of the 2,183 splash arts runs through Depth Anything V2 once, at build time. A small WebGL shader then sweeps near and far layers past each other, and falls back to the still image on slow devices.
  - title: Free to run
    text: About 15,000 prebuilt pages on Cloudflare's free plan and a data update on GitHub Actions twice a week. Nothing in it can send a bill.
  - title: Directing an AI developer
    text: I set the direction, designed and reviewed every screen, and Claude Code wrote most of the code.
methods:
  - Product design
  - SEO
  - Claude Code
  - Next.js
  - Tailwind CSS
  - Cloudflare Pages
  - GitHub Actions
  - WebGL
---
A League of Legends skin encyclopedia I designed and built in September 2026, with Claude Code as my developer. It answers the question players search for after opening a chest: is this skin rare, and what is it worth? Each of the 1,947 skins has a page that answers that first, then shows the art, the 3D model and the chromas. The data updates itself from Riot's own files, and hosting costs nothing. A fan project, not endorsed by Riot Games.
