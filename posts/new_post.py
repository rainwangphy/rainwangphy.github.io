#!/usr/bin/env python3
"""Create a new blog post from _template.html and add it to blog.html.

Usage:
    python3 posts/new_post.py "My post title" [--tags rl,agents] [--date 2026-08-23]

Then just open the printed file and write.
"""
import argparse
import datetime
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(ROOT, "posts")
TEMPLATE = os.path.join(POSTS, "_template.html")
INDEX = os.path.join(ROOT, "blog.html")


def slugify(title):
    s = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s or "post"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("title")
    ap.add_argument("--tags", default="", help="comma-separated, e.g. rl,agents")
    ap.add_argument("--date", default="", help="YYYY-MM-DD (default: today)")
    ap.add_argument("--summary", default="", help="one-line summary shown on the blog index")
    args = ap.parse_args()

    date = (datetime.date.fromisoformat(args.date) if args.date
            else datetime.date.today())
    pretty = date.strftime("%b %d, %Y").replace(" 0", " ")
    slug = slugify(args.title)
    name = "%s-%s.html" % (date.isoformat(), slug)
    path = os.path.join(POSTS, name)

    # Titles with no ASCII (e.g. Chinese) all slugify to "post"; add a suffix
    # rather than clobbering an existing file.
    n = 2
    while os.path.exists(path):
        name = "%s-%s-%d.html" % (date.isoformat(), slug, n)
        path = os.path.join(POSTS, name)
        n += 1

    tags = [t.strip() for t in args.tags.split(",") if t.strip()]
    tags_html = ("".join('<li class="tag">%s</li>' % t for t in tags))
    summary = args.summary or "ONE-SENTENCE SUMMARY OF THE POST."

    html = open(TEMPLATE, encoding="utf-8").read()
    html = html.replace("POST TITLE", args.title)
    html = html.replace("ONE-SENTENCE SUMMARY OF THE POST.", summary)
    html = html.replace("MONTH DD, YYYY", pretty)
    if tags_html:
        html = html.replace('<li class="tag">TAG</li>', tags_html)
    else:
        html = re.sub(r'\s*<ul class="tags">.*?</ul>\n', "\n", html, count=1, flags=re.S)
    open(path, "w", encoding="utf-8").write(html)

    entry = (
        '\n      <li>\n'
        '        <span class="date">%s</span>\n'
        '        <a class="post-title" href="posts/%s">%s</a>\n'
        '        <span class="post-excerpt">%s</span>\n'
        '%s'
        '      </li>\n' % (
            pretty, name, args.title, summary,
            ('        <ul class="tags">%s</ul>\n' % tags_html) if tags_html else "",
        )
    )

    index = open(INDEX, encoding="utf-8").read()
    anchor = '<ul class="post-list" id="post-list">\n'
    if anchor not in index:
        sys.exit("could not find the post list in blog.html")
    index = index.replace(anchor, anchor + entry, 1)
    open(INDEX, "w", encoding="utf-8").write(index)

    print("created posts/%s and linked it from blog.html" % name)


if __name__ == "__main__":
    main()
