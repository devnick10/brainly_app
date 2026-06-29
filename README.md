# Brainly App

Brainly is an AI-powered content bookmarking platform that helps users save, organize, search, and share content from YouTube, X (Twitter), articles, and other sources. Instead of relying only on exact keywords, Brainly uses vector embeddings and semantic search to retrieve content based on meaning and context.

## Features

- Secure user authentication using JWT
- Save content from YouTube, X (Twitter), articles, and documents
- Organize content with tags and categories
- AI-powered semantic search using vector embeddings
- Find saved content using natural language queries
- Public sharing of your entire content collection
- Unique shareable links for collaboration and discovery
- Responsive dashboard for managing saved content
- Fast vector similarity search powered by pgvector

## Tech Stack

### Frontend

- Next.js
- TypeScript
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Lucide React

### Backend

- Hono
- Cloudflare Workers
- Cloudflare Workers AI
- Prisma ORM
- PostgreSQL (Neon)
- pgvector
- Zod
- jose (JWT Authentication)

## Architecture

```text
Frontend (Next.js)
        │
        ▼
Cloudflare Workers (Hono API)
        │
        ▼
Cloudflare Workers AI
(Embedding Generation)
        │
        ▼
PostgreSQL + pgvector
(Vector Storage & Similarity Search)
```

## How Semantic Search Works

### Saving Content

1. User saves a link with title and description.
2. A searchable text representation is generated.
3. Cloudflare Workers AI generates a vector embedding.
4. The embedding is stored in PostgreSQL using pgvector.

```text
Save Content
      ↓
Generate Embedding
      ↓
Store Vector
      ↓
Persist Metadata
```

### Searching Content

1. User enters a search query.
2. Query embedding is generated.
3. pgvector performs similarity search.
4. Most relevant content is returned.

```text
Search Query
      ↓
Generate Query Embedding
      ↓
Vector Similarity Search
      ↓
Rank Results
      ↓
Return Relevant Content
```

## Database Features

- PostgreSQL relational data modeling
- Prisma ORM with type-safe queries
- pgvector for vector storage
- Vector similarity search
- Relational content, user, tag, and sharing models

## Getting Started

### Prerequisites

- Bun
- Node.js 20+
- Wrangler CLI
- Neon PostgreSQL Database
- Cloudflare Account with Workers AI enabled

### Installation

```bash
git clone https://github.com/devnick10/brainly_app.git

cd brainly_app

# Frontend
cd frontend
bun install

# Backend
cd ../backend
bun install
```

### Environment Variables

Frontend:

```env
VITE_BASE_URL=http://localhost:8787/api/v1
```

Backend:

```env
DATABASE_URL=
DIRECT_DATABASE_URL=
JWT_SECRET=
ACCESS_ORIGIN=
```

### Development

Backend:

```bash
cd backend
bun run dev
```

Frontend:

```bash
cd frontend
bun run dev
```

### Database

Generate Prisma Client:

```bash
bun run generate
```

Apply Schema Changes:

```bash
bunx prisma db push
```

## API Routes

| Method | Endpoint                   | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| POST   | `/api/v1/user/signup`      | Create account                      |
| POST   | `/api/v1/user/signin`      | Login user                          |
| GET    | `/api/v1/brain`            | Fetch saved content                 |
| POST   | `/api/v1/brain`            | Save content and generate embedding |
| DELETE | `/api/v1/brain/:contentId` | Delete content                      |
| GET    | `/api/v1/brain/search?q=`  | Semantic search                     |
| POST   | `/api/v1/brain/share`      | Create or remove share link         |
| GET    | `/api/v1/brain/:sharelink` | Access public shared collection     |

## Future Improvements

- Hybrid Search (Semantic + Full Text Search)
- Content recommendations
- AI-generated summaries
- Multi-modal search
- Personalized ranking
- Content clustering

## Key Learnings

- Cloudflare Workers & Edge Computing
- AI Embeddings and Semantic Search
- PostgreSQL Vector Databases
- Vector Similarity Search with pgvector
- Retrieval-Augmented Search Patterns

## Author

GitHub: https://github.com/devnick10
