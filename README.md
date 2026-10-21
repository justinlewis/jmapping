# jmapping.com

Personal site of Justin Lewis, served at <https://www.jmapping.com>. It is a
Jekyll site that grew out of the Voyager theme, built by GitHub Pages' native
Jekyll build from the `gh-pages` branch. There is no separate build step.

## Pages

| File | URL | What it is |
| --- | --- | --- |
| `index.html` | `/` | About, work at TerraFrame, talks and writing, community, off the clock |
| `community.html` | `/community/` | The longer story of West Slope Technologists and related work |
| `projects.md` | `/projects/` | Redirects to `/#work` |
| `redirects/*.html` | `/posts/<slug>/` | Redirects for the old blog posts, which were removed |

The layout is `_layouts/default.html`: a photo panel on the left
(`_includes/aside.html`), and a content column with a sticky nav
(`_includes/header.html`), the page content, and a footer
(`_includes/footer.html`). Below 60rem the photo becomes a banner at the top.
Social icons are inline SVG in `_includes/social.html`.

Styles are in `assets/_sass/`: `_variables.scss` (breakpoints, fonts, and the
light and dark color tokens as CSS custom properties) and `_site.scss`
(everything else). GitHub Pages compiles Sass with an old compiler, so wrap
modern CSS functions such as `clamp()`, `min()`, and `max()` in
`unquote("...")`.

## Setting a page's photo

Each page picks its panel photo in front matter. Paths are relative to
`assets/images/`.

```yaml
bg: "web/me_5.jpg"          # photo for the left panel / mobile banner
bg_position: "62% 20%"      # optional CSS object-position, to keep a face in frame
bg_alt: "Describe the photo" # alt text for the photo
```

Use the web-sized copies in `assets/images/web/` (about 1600px on the long
edge, JPEG quality 80). The originals of the portraits are kept in
`assets/images/` in case you want to make new crops.

## Link previews and descriptions

`_includes/head.html` writes the title, description, canonical URL, and Open
Graph and Twitter tags for every page. Two optional front matter keys
override the defaults:

```yaml
description: "One or two sentences for search results and link previews."
og_image: "web/some-image.jpg"  # relative to assets/images/, ideally 1200x630
```

Without them, the page uses the site description from `_config.yml` and
`assets/images/web/og-default.jpg`.

## Placeholders still to fill in

Missing facts are marked in the pages with `<span class="todo">…</span>`,
which shows as a yellow highlight with a dashed outline. Search for
`class="todo"` to find them.

`index.html`, Talks & writing:

- Cloud-Native Geospatial Forum talk (Snowbird, Utah): year and talk title
- FOSS4G 2026 paper: title and link, and its status (for example, accepted or presented)
- 2023 Spatial Knowledge Mesh paper: title and link, and venue
- "Give Your Software Away" (TEDxGrandJunction): year
- "Rethinking the Data Pipeline for Better Integration and Collaboration": year and venue
- "Turning Data into Information with Geo-Ontologies": year and venue
- "A Model for Open Data in Colorado": year and venue

`index.html`, other sections:

- Off the clock: one more line after "Outside of work I'm usually climbing…"
- What I do at TerraFrame: an optional customer testimonial. A ready-to-use
  pull quote is commented out at the end of the section.

`community.html`:

- The Rural Tech Retreat: when it ran, attendance, what the semi-off-grid
  setup looked like, the program, and why it mattered
- West Slope Startup Week: themes or standout sessions from the Technology Track
- Where it stands: one honest sentence on what carries on

## Previewing locally

```sh
bundle exec jekyll serve
```

Then open <http://localhost:4000>. If you don't have a Gemfile set up,
`jekyll serve` with a locally installed Jekyll 3.x works too. Inline scripts
must not use `//` comments: `_layouts/compress.html` collapses each page onto
one line, so a `//` comment would swallow the rest of the script.
