# Intervix

Intervix is a Next.js app that generates interview questions with an AI model and stores finalized interviews in Firebase.

## Features

- Generate interview questions for a given role/level/tech stack
- Persist generated interviews to Firebase (`interviews` collection)

## Prerequisites

- Node.js (LTS recommended)
- A Firebase project

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Configure environment variables

Create a `.env.local` file in the project root and add the required Firebase/admin credentials.

> The exact variable names are defined in the Firebase config used by the app (see `firebase/admin.ts`).

3. Run the development server

```bash
npm run dev
```

Open:

- http://localhost:3000

## API: Generate interview questions

The app exposes an endpoint that generates and finalizes interview questions:

- **POST** `/api/vapi/generate`

### Request body

Send JSON with the following fields:

- `type`: (string) Behavioral/technical preference (passed directly into the prompt)
- `role`: (string) Job role
- `level`: (string) Experience level
- `techstack`: (string) Comma-separated tech stack (split by `,` in the API)
- `amount`: (number) Amount of questions to generate
- `userid`: (string) User identifier stored as `userId`

### Response

- `200` on success: `{ "success": true }`
- `500` on error: `{ "success": false, "error": ... }`

### Notes

- Generated questions are parsed from JSON and stored as `questions`.
- The API saves documents to the Firebase collection: `interviews`.

## Deployment

This is a standard Next.js app and can be deployed on platforms like **Vercel**.

1. Set the same environment variables in your production environment
2. Deploy

## Development scripts

Common scripts from `package.json`:

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm start` – run production server
