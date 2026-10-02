# Tova UI mockup

Interactive preview: open `index.html` in a browser. The preview uses fixture data and does not connect to the backend.

Figma file: https://www.figma.com/design/kfSZ7CLskTITeHUXjaER6r

The native Figma file contains composed Today, Students/tag search, Student/scheduling, and Month calendar screens. Lesson Record, Parent desktop, and Parent mobile currently have empty wrappers because the Figma MCP Starter plan call limit was reached. All views, plus an account-entry example, are available in the HTML preview.

The preview carries through the source site's Tova wordmark, leaf vector, Noto Sans TC, Sacramento, IBM Plex Mono, warm neutrals, and dusty red palette. Key interactions include subject suggestions and new tags, student colors, student-origin scheduling, calendar synchronization, editable teacher notes, confirmed summaries, and parent-visible shared snapshots.

`figma-remaining.js` contains the pending native composition for the three remaining screens. Run it through `use_figma` against the file key in `figma-state.json` after Figma tool access becomes available. Load the figma-use, figma-generate-design, and figma-generate-library skills first. The three target wrappers must still be empty; inspect them before resuming. After composition, inspect font families and editable-layer counts, then visually review all seven screens. The native Figma screens have not received screenshot review because the quota expired.

The local preview was checked for JavaScript syntax and core interactions using the repository's existing JSDOM. Browser screenshot review was unavailable in this session.
