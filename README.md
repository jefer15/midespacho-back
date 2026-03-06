# MiDespacho — Backend

NestJS REST API for the MiDespacho legal case management system. Handles case records, document batch uploads, and static file serving backed by PostgreSQL via TypeORM.

---

## Tech Stack

| Technology | Version |
|---|---|
| NestJS | 11 |
| TypeORM | 0.3 |
| PostgreSQL | ≥ 14 |
| Multer | 2.1 |
| Node.js | ≥ 20 |
| TypeScript | 5.7 |

---

## Prerequisites

- Node.js `>= 20`
- npm `>= 9`
- PostgreSQL instance running and accessible

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jefer15/midespacho.git
cd midespacho/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

```env
# .env.example
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=midespacho
```

### 4. Create the database

```bash
psql -U postgres -c "CREATE DATABASE midespacho;"
```

TypeORM is configured with `synchronize: true` in development, so tables are created automatically on first run.

### 5. Start the development server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

Uploaded files are served statically at `http://localhost:3000/files/<path>`.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the HTTP server listens on | `3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASS` | PostgreSQL password | `postgres` |
| `DB_NAME` | PostgreSQL database name | `midespacho` |

---
## Project Structure

```
src/
├── config/                        # App configuration (TypeORM, env validation)
├── modules/
│   ├── cases/
│   │   ├── dto/
│   │   │   ├── create-case.dto.ts      
│   │   │   ├── update-case.dto.ts      
│   │   │   ├── upload-batch.dto.ts     
│   │   │   ├── query-cases.dto.ts      
│   │   │   └── cases-page.dto.ts       
│   │   ├── entities/
│   │   │   ├── case.entity.ts          
│   │   │   ├── file-batch.entity.ts    
│   │   │   └── case-file.entity.ts    
│   │   ├── cases.controller.ts         
│   │   ├── cases.service.ts            
│   │   └── cases.module.ts
│   └── storage/
│       ├── storage.service.ts          
│       └── storage.module.ts
├── app.module.ts                       
└── main.ts                             
public/
└── cases/                             
    └── <caseNumber>/
        └── batch-<n>/
            └── <uuid>.<ext>
```

---

## API Reference

Base URL: `http://localhost:3000`

Static files: `GET /files/<relativePath>`

---

### Cases

#### List cases

```
GET /cases
```

Query parameters:

| Param | Type | Description |
|---|---|---|
| `page` | `number` | Page number (default: `1`) |
| `pageSize` | `number` | Items per page (default: `10`) |
| `search` | `string` | Search across case number, client, attorney, subject |

Response `200`:

```json
{
  "data": [ { "id": 1, "caseNumber": "EXP-001", "clientName": "...", "..." : "..." } ],
  "total": 42,
  "page": 1,
  "pageSize": 10,
  "totalPages": 5
}
```

---

#### Get one case

```
GET /cases/:id
```

Returns the case with all its batches and files nested.

Response `200`:

```json
{
  "id": 1,
  "caseNumber": "EXP-001",
  "clientName": "John Doe",
  "attorney": "Jane Smith",
  "subject": "Civil",
  "court": "District Court",
  "status": "active",
  "description": "...",
  "openingDate": "2024-01-15T00:00:00.000Z",
  "dueDate": "2025-06-30T00:00:00.000Z",
  "batches": [
    {
      "id": 1,
      "title": "Initial Filing",
      "description": "Documents submitted on opening",
      "folderPath": "cases/EXP-001/batch-1",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "files": [
        {
          "id": 1,
          "originalName": "complaint.pdf",
          "storedName": "uuid.pdf",
          "relativePath": "cases/EXP-001/batch-1/uuid.pdf",
          "mimetype": "application/pdf",
          "size": 204800
        }
      ]
    }
  ]
}
```

---

#### Create case

```
POST /cases
Content-Type: application/json
```

Body:

```json
{
  "caseNumber": "EXP-001",
  "clientName": "John Doe",
  "attorney": "Jane Smith",
  "subject": "Civil",
  "court": "District Court",
  "status": "active",
  "description": "Case description",
  "openingDate": "2024-01-15",
  "dueDate": "2025-06-30"
}
```

Response `201`: Created case object.

---

#### Update case

```
PATCH /cases/:id
Content-Type: application/json
```

Body: any subset of the create payload.

Response `200`: Updated case object.

---

#### Delete case

```
DELETE /cases/:id
```

Response `200`.

---

### Document Batches

#### Upload a batch

```
POST /cases/:id/batches
Content-Type: multipart/form-data
```

| Field | Type | Description |
|---|---|---|
| `files` | `File[]` | Up to 30 files |
| `title` | `string` | Batch title |
| `description` | `string` | Batch description |

Files are stored at `public/cases/<caseNumber>/batch-<n>/` and served via `GET /files/<relativePath>`.

Response `201`: Created `FileBatch` with nested `files` array.

---

#### Delete a batch

```
DELETE /cases/batches/:id
```

Deletes the batch record and all associated file records. Physical files on disk are not removed.

Response `200`.

---

### Files

#### Delete a file

```
DELETE /cases/files/:id
```

Deletes the file record from the database. The physical file on disk is not removed.

Response `200`.

---

#### Serve a static file

```
GET /files/<relativePath>
```

Example:

```
GET /files/cases/EXP-001/batch-1/3f2a1b4c-uuid.pdf
```

Files are served from the `public/` directory at the project root.