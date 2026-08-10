# Elementrix

[![CI](https://github.com/noanoa2162-ops/elementrix/actions/workflows/ci.yml/badge.svg)](https://github.com/noanoa2162-ops/elementrix/actions/workflows/ci.yml)

Elementrix is a responsive, RTL **frontend prototype** for discovering, sharing, reviewing, and purchasing reusable UI components with virtual points. It demonstrates a multi-page TypeScript application with a catalog, role-based demo flows, moderation, and browser-side persistence.

## Highlights

- Searchable and filterable catalog with 60 sample components
- Component detail pages with syntax-highlighted HTML, CSS, and JavaScript
- Local upload, review, rating, and virtual-purchase workflows
- User and administrator demo experiences
- Responsive Hebrew RTL interface with reusable CSS modules
- Strict TypeScript configuration and committed browser builds
- Automated security/documentation checks and GitHub Actions CI

## Demo model

This repository is intentionally a client-side portfolio project. It has no backend, real authentication, payment processing, or multi-user synchronization.

- Profiles and activity are stored only in the browser's `localStorage`.
- Passwords are neither requested nor stored.
- Enter `demo-admin` on the opening screen to explore the administrator workflow.
- New local demo profiles receive virtual points for exercising the marketplace flow.
- Clearing site data resets the local demo.

Do not enter sensitive or real personal information.

## Run locally

```bash
npm ci
npm run typecheck
npm test
npm run build
python -m http.server 8000
```

Then open <http://localhost:8000>. A local web server is recommended so every page and asset is loaded consistently.

## Quality checks

```bash
npm run typecheck  # strict TypeScript validation
npm run build      # regenerate browser JavaScript
npm test           # Node-based security and repository checks
```

CI runs all three checks and verifies that the generated JavaScript matches the committed TypeScript source. User-controlled names and descriptions are encoded before insertion into HTML templates.

## Project structure

```text
elementrix/
├── index.html              # Local demo profile selection
├── pages/                  # Store, component, upload, profile, and admin views
├── js/                     # TypeScript source and generated browser JavaScript
├── css/                    # Responsive layout and visual modules
├── data/                   # Sample component catalog
├── tests/                  # Repository and safety checks
└── .github/workflows/      # Continuous integration
```

## Technical decisions

- **TypeScript without a framework:** keeps the project focused on DOM, state, and browser API fundamentals.
- **LocalStorage adapter:** provides persistent demo state without pretending that a backend exists.
- **Generated JavaScript committed:** lets the static site run without a deployment build step; CI prevents source/build drift.
- **Explicit prototype boundaries:** administrator roles and purchases are interaction simulations, not security or commerce features.

## Project history

Originally developed in **November 2025** as a TypeScript course project by Noa Binet. Portfolio hardening in **August 2026** added CI, automated checks, safer HTML rendering, honest demo-profile semantics, and English documentation while preserving the original application and commit.

## Known limitations

- State is browser-local and is not shared between devices.
- Uploaded snippets are catalog content; this project does not provide a sandbox for executing untrusted code.
- The demo administrator role is a UI workflow, not an authorization boundary.
- External icon and syntax-highlighting assets require network access unless vendored locally.
