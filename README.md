# Brainly

Brainly is an AI-powered content bookmarking platform that helps users save, organize, search, and share content from YouTube, X (Twitter), articles, and other sources.

Unlike traditional bookmarking applications, Brainly uses semantic search powered by vector embeddings, allowing users to retrieve content based on meaning rather than exact keywords.

The application is built on Cloudflare's edge platform using an event-driven architecture. Content enrichment (metadata extraction and embedding generation) is performed asynchronously through Cloudflare Queues, keeping API responses fast and scalable.

---

# Features

- JWT Authentication
- Save content from YouTube, X (Twitter), articles, and documents
- AI-powered semantic search using vector embeddings
- Automatic metadata extraction
- Tag-based organization
- Public shareable collections
- Background content processing
- Retry failed processing jobs
- Fast vector similarity search with pgvector
- Event-driven architecture using Cloudflare Queues

---

# Tech Stack

## Frontend

- Next.js
- TypeScript
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Lucide React

## Backend

- Hono
- Cloudflare Workers
- Cloudflare Queues
- Cloudflare Workers AI
- Prisma ORM
- Prisma Accelerate
- PostgreSQL (Neon)
- pgvector
- Zod
- jose (JWT Authentication)

## Infrastructure

- Turborepo
- Bun
- Wrangler

---

# Architecture

```text
                           ┌────────────────────┐
                           │      Client        │
                           └─────────┬──────────┘
                                     │
                                     ▼
                        ┌────────────────────────┐
                        │ API Worker (Hono)      │
                        │                        │
                        │ • Authentication       │
                        │ • CRUD                 │
                        │ • Semantic Search      │
                        │ • Queue Publisher      │
                        └─────────┬──────────────┘
                                  │
                                  │ Queue.send(contentId)
                                  ▼
                      ┌──────────────────────────┐
                      │  Cloudflare Queue        │
                      └──────────┬───────────────┘
                                 │
                                 ▼
                    ┌────────────────────────────┐
                    │ Processor Worker (Hono)    │
                    │                            │
                    │ • Consume Queue            │
                    │ • Fetch Metadata           │
                    │ • Generate Embeddings      │
                    │ • Update Database          │
                    │ • Retry Failed Jobs        │
                    └──────────┬─────────────────┘
                               │
              ┌────────────────┴──────────────┐
              ▼                               ▼
      Cloudflare Workers AI          Metadata Providers
             │                     (OpenGraph, YouTube)
             └──────────────┬──────────────────────────┘
                            ▼
                   PostgreSQL + pgvector
```

---

# Repository Structure

```text
brainly_app/
│
├── apps/
│   ├── api/
│   ├── processor/
│   └── web/
│
├── packages/
│   ├── ai/
│   └── db/
│
├── turbo.json
└── package.json
```

---

# Content Processing Pipeline

## Creating Content

When a user saves content, the API immediately stores the basic information and publishes a background job.

```text
Client
    │
    ▼
POST /brain
    │
    ▼
Insert Content
status = PROCESSING
    │
    ▼
Publish Queue Message
(contentId)
    │
    ▼
201 Created
```

---

## Background Processing

The Processor Worker consumes queue messages and enriches the content asynchronously.

```text
Cloudflare Queue
        │
        ▼
Processor Worker
        │
        ▼
Load Content
        │
        ▼
Fetch Metadata
        │
        ▼
Generate Embedding
        │
        ▼
Update Database
        │
        ▼
status = COMPLETED
```

---

## Semantic Search

Search queries are converted into vector embeddings and compared against stored content using pgvector similarity search.

```text
Search Query
      │
      ▼
Generate Query Embedding
      │
      ▼
Vector Similarity Search
      │
      ▼
Rank Results
      │
      ▼
Return Relevant Content
```

---

# Retry Flow

If background processing fails, the content is marked as `FAILED`.

An administrator or automated system can trigger a retry.

```text
FAILED
   │
POST /retry/:contentId
   │
   ▼
status = PROCESSING
   │
   ▼
Queue.send(contentId)
   │
   ▼
Processor Worker
```

---

# Content Lifecycle

```text
PROCESSING
      │
      ▼
Metadata + Embedding Generated
      │
      ▼
COMPLETED
      │
      └────────────► FAILED
                          │
                          ▼
                    Retry Processing
```

---

# Why Asynchronous Processing?

Metadata extraction and AI embedding generation involve external services and can significantly increase request latency.

Instead of performing these operations during the API request, Brainly publishes a message to Cloudflare Queues and immediately responds to the client.

A dedicated Processor Worker enriches the content in the background, improving:

- Lower API latency
- Better scalability
- Fault tolerance
- Automatic retries
- Separation of concerns

---

# Database Features

- PostgreSQL relational data model
- Prisma ORM with type-safe queries
- pgvector for vector storage
- Vector similarity search
- Many-to-many content tagging
- Shareable public collections

---

# Getting Started

## Prerequisites

- Bun
- Node.js 20+
- Wrangler CLI
- Neon PostgreSQL
- Cloudflare Account
- Workers AI Enabled

---

## Installation

```bash
git clone https://github.com/devnick10/brainly_app.git

cd brainly_app

bun install
```

---

## Environment Variables

### API Worker

```env
DATABASE_URL=
JWT_SECRET=
ACCESS_ORIGIN=
```

### Processor Worker

```env
DATABASE_URL=
```

### Frontend

```env
NEXT_PUBLIC_API_URL=
```

---

## Development

Run all applications:

```bash
bun run dev
```

Or run individual apps:

```bash
bun turbo dev --filter=api
bun turbo dev --filter=processor
bun turbo dev --filter=web
```

---

## Database

Generate Prisma Client

```bash
bunx prisma generate
```

Push Schema

```bash
bunx prisma db push
```

---

# API Routes

| Method | Endpoint                   | Description                        |
| ------ | -------------------------- | ---------------------------------- |
| POST   | `/api/v1/user/signup`      | Create account                     |
| POST   | `/api/v1/user/signin`      | User login                         |
| GET    | `/api/v1/brain`            | List saved content                 |
| POST   | `/api/v1/brain`            | Save new content                   |
| DELETE | `/api/v1/brain/:contentId` | Delete content                     |
| GET    | `/api/v1/brain/search?q=`  | Semantic search                    |
| POST   | `/api/v1/brain/share`      | Create or remove public share link |
| GET    | `/api/v1/brain/:shareLink` | View shared collection             |

### Processor

| Method | Endpoint                | Description             |
| ------ | ----------------------- | ----------------------- |
| POST   | `/api/retry/:contentId` | Retry failed processing |
| GET    | `/api/health`           | Health check            |

---

# Future Improvements

- Hybrid Search (Semantic + Full Text Search)
- Dead Letter Queue
- Content recommendations
- AI-generated summaries
- Personalized ranking
- Batch embedding generation
- Observability & metrics
- Content deduplication

---

# Key Learnings

- Event-driven architecture
- Cloudflare Workers
- Cloudflare Queues
- Workers AI
- Edge computing
- Semantic search
- PostgreSQL + pgvector
- Background job processing
- Monorepo architecture with Turborepo

---

# Author

GitHub: https://github.com/devnick10
