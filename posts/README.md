# Blog posts

Every post is a standalone HTML file in this folder; there is no build step
(the site has `.nojekyll`, so GitHub Pages serves these files as-is).

## Write a new post

```bash
python3 posts/new_post.py "Why world models are hard" --tags agents,rl \
  --summary "Notes from a year of trying to make LLM world models useful."
```

That copies `_template.html` into `posts/YYYY-MM-DD-slug.html`, fills in the
title/date/tags, and inserts the entry at the top of the list in `blog.html`.
Then open the new file and write inside `<div class="post-body"> ... </div>`.

## Or do it by hand

1. `cp posts/_template.html posts/2026-09-01-my-post.html`
2. Replace `POST TITLE`, `MONTH DD, YYYY`, the `<meta name="description">`, and the tags.
3. Add an `<li>` at the top of the `<ul class="post-list">` in `blog.html`.

## Markup you can use in `.post-body`

`<h2>`/`<h3>`, `<p>`, `<ul>`/`<ol>`, `<blockquote>`, `<pre><code>`, `<table>`,
`<img src="../picture/foo.png">`, `<code>` — all already styled for light and
dark themes in `assets/css/style.css`.

Images go in `../picture/`, PDFs in `../pdf/`.
