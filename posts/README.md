# Blog posts

Every post is a standalone HTML file in this folder; there is no build step
(the site has `.nojekyll`, so GitHub Pages serves these files as-is).

Each post holds **both an English and a Chinese version in the same file**.
Readers switch with the EN / 中文 control above the article; the choice is saved in
`localStorage` and carries across posts. `post.html#zh` / `#en` link straight
to one language, which is handy when sharing.

The blog index (`blog.html`) and the rest of the site stay in English — only
posts are bilingual, and the switch appears only on a post page.

## Write a new post

```bash
python3 posts/new_post.py "Why world models are hard" --zh "世界模型难在哪里" \
  --tags agents,rl \
  --summary "Notes from a year of trying to make LLM world models useful." \
  --summary-zh "折腾了一年 LLM 世界模型之后的一些笔记。"
```

That copies `_template.html` into `posts/YYYY-MM-DD-slug.html`, fills in both
titles, both dates and the tags, and inserts the entry at the top of the list in
`blog.html`. Then open the new file and write the two bodies:

```html
<div class="post-body" lang="en"> ...English... </div>
<div class="post-body" lang="zh"> ...中文... </div>
```

Both blocks must stay — a language with an empty block shows an empty page.

## How the switching works

- `<html ... data-bilingual>` marks a page as having translations. Only such
  pages hide anything, and only they carry the EN / 中文 switch — so `blog.html`,
  `index.html`, `publications.html`, and `lab.html` are unaffected.
- Anything marked `lang="en"` or `lang="zh"` is shown/hidden by CSS
  (`assets/css/style.css`, "language switch" section). This is plain CSS, so it
  works before the JS runs — no flash of the wrong language.
- `<title data-t-zh="中文标题 · Xinrun Wang">` gives the tab a Chinese title too.
- Avoid putting `lang="en"` on a stray element inside a Chinese block (e.g. to
  mark an English term) — it would be hidden in Chinese mode.

## Or do it all by hand

1. `cp posts/_template.html posts/2026-09-01-my-post.html`
2. Replace `POST TITLE`, `中文标题`, `MONTH DD, YYYY`, `YYYY年M月D日`, the
   `<meta name="description">`, and the tags.
3. Add an `<li>` at the top of the `<ul class="post-list">` in `blog.html`
   (English date, title, and excerpt — the index is not bilingual).

## Markup you can use in `.post-body`

`<h2>`/`<h3>`, `<p>`, `<ul>`/`<ol>`, `<blockquote>`, `<pre><code>`, `<table>`,
`<img src="../picture/foo.png">`, `<code>` — all already styled for light and
dark themes.

Images go in `../picture/`, PDFs in `../pdf/`.

## After changing CSS or JS

`style.css` and `main.js` are linked with a `?v=YYYYMMDD` version, because
GitHub Pages tells browsers to cache assets for 10 minutes and returning
visitors would otherwise keep the old file. When you edit either asset, bump
that number in every HTML file:

```bash
grep -rl 'assets/css/style.css?v=' *.html posts/*.html | \
  xargs sed -i '' 's/?v=[0-9]\{8\}/?v=20260901/g'
```
