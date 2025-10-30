# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- **Run development server:** `npm run dev`
- **Build for production:** `npm run build`
- **Run production server:** `npm run start`
- **Lint the codebase:** `npm run lint`
- **Seed the database:** `npm run prisma:seed`

## High-level Architecture

This is a [Next.js](https://nextjs.org/) application using the App Router. The main parts of the application are in the `app` directory, with a directory-based routing structure.

- **`app/`**: Contains the pages and layouts of the application. Key sections include `dashboard`, `follow`, `library`, `report`, and `settings`.
- **`components/`**: Contains reusable React components used throughout the application.
- **`lib/`**: Contains utility functions and libraries.
- **`hooks/`**: Contains custom React hooks.
- **`prisma/`**: Contains the Prisma schema (`schema.prisma`) and database seeding scripts.

### Data Fetching

The application uses [Prisma](https://www.prisma.io/) as the ORM to interact with the database. Data fetching from the client-side is handled by [TanStack Query](https://tanstack.com/query/latest) (React Query). Look for `useQuery` and `useMutation` hooks for data fetching and mutations.

### Styling

Styling is done using [Tailwind CSS](https://tailwindcss.com/). Utility classes are used directly in the components. Global styles are in `app/globals.css`.
