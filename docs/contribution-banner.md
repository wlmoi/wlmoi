# GitHub contribution city

The README banner is a standalone SVG generated from the public contribution calendar at https://github.com/users/wlmoi/contributions. Every tile represents a calendar day. Building height follows the square root of the contribution count to keep large days readable; color uses GitHub's contribution levels. No sample activity is added.

`public/github-contributions.html` provides the interactive canvas version with pointer rotation, zoom, keyboard controls, a reset button, daily hover details, and an accessible data table. It reads the checked-in `public/contributions.json`; there are no browser credentials or runtime API requests to GitHub. The README links to this page because GitHub's image rendering does not run JavaScript.

Run `python scripts/generate_contribution_banner.py` to fetch and render the current public calendar. Python's standard library is sufficient. The parser requires a complete calendar and all daily counts; an upstream markup change fails the run rather than publishing invented data. The last successful files remain committed.

The `Refresh contribution banner` workflow runs daily at 23:23 UTC (06:23 Jakarta the following day), when the generator or workflow changes, or on manual dispatch. It commits only the generated banner and JSON. Scheduled jobs can be delayed by GitHub. The workflow requires repository contents write permission to commit its output.

Verification: SVG XML parsing, real data consistency, browser tests for rotation, zoom, reset, keyboard controls, desktop and mobile layouts, and screenshots under the local outputs directory.
