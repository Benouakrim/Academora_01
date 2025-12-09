# Prisma 7 Migration Guide - Complete Reference

**Project**: Academora_02  
**Date**: December 9, 2025  
**Migration**: Prisma 6.x → Prisma 7.1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Key Differences: Prisma 6 vs Prisma 7](#key-differences-prisma-6-vs-prisma-7)
3. [Breaking Changes](#breaking-changes)
4. [Migration Process](#migration-process)
5. [Implementation Details](#implementation-details)
6. [Errors Encountered & Fixes](#errors-encountered--fixes)
7. [Best Practices](#best-practices)
8. [Complete Guide](#complete-guide)

---

## Overview

Prisma 7 introduces a significant architectural change in how database connections and configurations are handled. The most notable change is the separation of connection configuration from the schema file into a dedicated `prisma.config.ts` file.

### Version Information
- **Previous Version**: Prisma 6.x (or earlier)
- **Current Version**: Prisma 7.1.0
- **Database**: PostgreSQL (Neon with connection pooling)
- **Project Type**: TypeScript Node.js Backend

---

## Key Differences: Prisma 6 vs Prisma 7

### 1. **Configuration Architecture**

#### Prisma 6 and Earlier
```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ✅ Allowed in Prisma 6
}
```

#### Prisma 7
```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  // ❌ NO url property here anymore
}
```

```typescript
// prisma.config.ts (NEW FILE - Required)
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),  // ✅ Connection URL moved here
  },
})
```

### 2. **File Location Requirements**

| File | Prisma 6 | Prisma 7 |
|------|----------|----------|
| `schema.prisma` | `prisma/schema.prisma` | `prisma/schema.prisma` (unchanged) |
| Database URL | Inside `schema.prisma` | In `prisma.config.ts` |
| `prisma.config.ts` | ❌ Not required | ✅ **Required** at project root |

### 3. **Client Instantiation**

#### Prisma 6
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export { prisma }
```

#### Prisma 7 (with Adapters)
```typescript
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
```

### 4. **Required Packages**

#### Prisma 6
```json
{
  "dependencies": {
    "@prisma/client": "^6.x.x"
  },
  "devDependencies": {
    "prisma": "^6.x.x"
  }
}
```

#### Prisma 7 (PostgreSQL with node-postgres)
```json
{
  "dependencies": {
    "@prisma/client": "^7.1.0",
    "@prisma/adapter-pg": "^7.1.0",
    "pg": "^8.x.x",
    "dotenv": "^16.x.x"
  },
  "devDependencies": {
    "prisma": "^7.1.0",
    "@types/node": "^20.x.x",
    "@types/pg": "^8.x.x"
  }
}
```

### 5. **CLI Command Changes**

| Command | Prisma 6 | Prisma 7 |
|---------|----------|----------|
| `prisma studio` | `npx prisma studio` | `npx prisma studio --config ./prisma.config.ts` |
| `prisma migrate diff` | `--to-schema-datamodel` | `--to-schema` (flag renamed) |
| All commands | Read from schema.prisma | Load config from prisma.config.ts |

---

## Breaking Changes

### 1. **P1012 Error - Datasource URL Property**

**Error Message:**
```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: The datasource property `url` is no longer supported in schema files.
```

**Cause:**  
The `url` property in the `datasource` block is deprecated in Prisma 7.

**Solution:**  
Move the connection URL from `schema.prisma` to `prisma.config.ts`.

### 2. **Configuration File Location**

**Issue:**  
Placing `prisma.config.ts` inside the `prisma/` directory causes errors.

**Error:**
```
Error: The datasource property is required in your Prisma config file when using prisma migrate dev.
```

**Solution:**  
The `prisma.config.ts` file **must be at the project root**, not inside the `prisma/` directory.

```
project-root/
├── prisma.config.ts          ✅ Correct location
├── .env
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── prisma.config.ts      ❌ Wrong location
```

### 3. **Shadow Database with Connection Pooling**

**Issue:**  
When using connection pooling (like Neon's `-pooler` URL), Prisma Migrate requires a direct database connection for the shadow database.

**Error:**
```
Error: P3006
Migration failed to apply cleanly to the shadow database.
Error code: P1001
Can't reach database server
```

**Workaround Options:**

**Option A: Add Direct URL**
```typescript
// prisma.config.ts
export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),           // Pooled connection
    directUrl: env('DIRECT_DATABASE_URL'), // Direct connection
  },
})
```

**Option B: Use `prisma db push` for Development**
```bash
npx prisma db push  # Doesn't require shadow database
```

---

## Migration Process

### Step-by-Step Migration from Prisma 6 to Prisma 7

#### **Step 1: Update Dependencies**

```bash
# Remove old Prisma packages
npm uninstall @prisma/client prisma

# Install Prisma 7 with required adapters
npm install prisma@7.1.0 @types/node @types/pg --save-dev
npm install @prisma/client@7.1.0 @prisma/adapter-pg pg dotenv
```

#### **Step 2: Create prisma.config.ts**

Create `prisma.config.ts` at the **project root**:

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
```

#### **Step 3: Update schema.prisma**

Remove the `url` property from the datasource block:

**Before:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // Remove this line
}
```

**After:**
```prisma
datasource db {
  provider = "postgresql"
}
```

#### **Step 4: Update Prisma Client Instantiation**

Update your database client file (e.g., `lib/prisma.ts` or `lib/db.ts`):

**Before (Prisma 6):**
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export { prisma }
```

**After (Prisma 7):**
```typescript
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }
```

#### **Step 5: Baseline Existing Database (if applicable)**

If you have an existing database with data:

```bash
# Create baseline migration directory
mkdir -p prisma/migrations/0_init

# Generate baseline migration
npx prisma migrate diff \
  --from-empty \
  --to-schema prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql

# Mark migration as applied
npx prisma migrate resolve --applied 0_init
```

#### **Step 6: Generate Prisma Client**

```bash
npx prisma generate
```

#### **Step 7: Verify Configuration**

```bash
# Check that schema loads correctly
npx prisma validate

# Push schema to database (for development)
npx prisma db push

# Or create a new migration (requires shadow database)
npx prisma migrate dev --name verify_setup
```

---

## Implementation Details

### Our Project Implementation

#### **1. Project Structure**

```
server/
├── prisma.config.ts           ← Configuration file (root level)
├── .env                       ← Environment variables
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma          ← Schema without url property
│   ├── migrations/            ← Migration history
│   │   └── 20251208205719_enhance_claims_system/
│   │       └── migration.sql
│   └── seed.ts
└── src/
    ├── index.ts
    └── lib/
        └── db.ts              ← Prisma Client with adapter
```

#### **2. Environment Configuration**

**.env file:**
```env
# Database Connection (Neon with Pooling)
DATABASE_URL="postgresql://user:password@host-pooler.neon.tech/db?sslmode=require&channel_binding=require"

# Optional: Direct connection for migrations
# DIRECT_DATABASE_URL="postgresql://user:password@host.neon.tech/db?sslmode=require"
```

#### **3. Database Setup**

- **Provider**: PostgreSQL
- **Host**: Neon (Serverless Postgres)
- **Connection**: Pooled connection (`-pooler` suffix)
- **Adapter**: `@prisma/adapter-pg` with `pg` driver

#### **4. Migration Strategy**

Given the connection pooling limitation, we chose:

✅ **Use `prisma db push` for development**  
- No shadow database required
- Immediate schema synchronization
- Perfect for rapid development iterations

❌ **Avoid `prisma migrate dev` without direct URL**  
- Requires shadow database
- Needs non-pooled connection
- Better for production workflows

---

## Errors Encountered & Fixes

### Error 1: P1012 - Datasource URL Not Supported

**Full Error:**
```
Error: Prisma schema validation - (get-config wasm)
Error code: P1012
error: The datasource property `url` is no longer supported in schema files.
Move connection URLs for Migrate to `prisma.config.ts`
  -->  prisma\schema.prisma:9
   |
 8 |   provider = "postgresql"
 9 |   url      = env("DATABASE_URL")
   |
```

**Root Cause:**  
Using Prisma 6 schema format in Prisma 7.

**Fix Applied:**
1. Removed `url = env("DATABASE_URL")` from `schema.prisma`
2. Created `prisma.config.ts` with datasource configuration

**Files Modified:**
- `prisma/schema.prisma` - Removed url property
- `prisma.config.ts` - Created with proper configuration

---

### Error 2: Config File Location Issue

**Error:**
```
Error: The datasource property is required in your Prisma config file when using prisma migrate dev.
```

**Root Cause:**  
`prisma.config.ts` was initially placed inside `prisma/` directory instead of project root.

**Fix Applied:**
```powershell
# Move config file to root
Move-Item -Path "prisma\prisma.config.ts" -Destination "prisma.config.ts" -Force
```

**Correct Structure:**
```
server/
├── prisma.config.ts     ✅ Root level
└── prisma/
    └── schema.prisma
```

---

### Error 3: Migration Drift

**Error:**
```
- Drift detected: Your database schema is not in sync with your migration history.
- The following migration(s) are applied to the database but missing from the local migrations directory:
  20251208205719_enhance_claims_system
```

**Root Cause:**  
Migration history in database didn't match local migration files.

**Fix Applied:**

**Step 1:** Create missing migration directory
```bash
mkdir -p prisma/migrations/20251208205719_enhance_claims_system
```

**Step 2:** Generate baseline migration
```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema prisma/schema.prisma \
  --script > prisma/migrations/20251208205719_enhance_claims_system/migration.sql
```

**Step 3:** Verify migration already applied in database
```bash
npx prisma migrate resolve --applied 20251208205719_enhance_claims_system
```

---

### Error 4: Command Syntax Change

**Error:**
```
Error: `--to-schema-datamodel` was removed. Please use `--[from/to]-schema` instead.
```

**Root Cause:**  
Using deprecated Prisma 6 command syntax.

**Fix Applied:**

**Old (Prisma 6):**
```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
```

**New (Prisma 7):**
```bash
npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script
```

---

### Error 5: Shadow Database Connection (P3006)

**Full Error:**
```
Error: P3006
Migration `20251208205719_enhance_claims_system` failed to apply cleanly to the shadow database.
Error code: P1001
Can't reach database server at `host-pooler.neon.tech:5432`
```

**Root Cause:**  
Using pooled connection URL for migrations. Prisma Migrate needs a direct database connection to create a temporary shadow database.

**Solution Options:**

**Option A: Add Direct URL (Recommended for Production)**
```typescript
// prisma.config.ts
export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),           // Pooled
    directUrl: env('DIRECT_DATABASE_URL'), // Direct
  },
})
```

```env
# .env
DATABASE_URL="postgresql://user:pass@host-pooler.neon.tech/db"
DIRECT_DATABASE_URL="postgresql://user:pass@host.neon.tech/db"
```

**Option B: Use db push (Our Implementation)**
```bash
npx prisma db push  # No shadow database needed
```

**Result:**
```
✓ The database is already in sync with the Prisma schema.
```

---

## Best Practices

### 1. **Project Setup Checklist**

- [ ] Install all required packages (`@prisma/client`, `@prisma/adapter-pg`, `pg`, etc.)
- [ ] Create `prisma.config.ts` at project root (not in prisma/ folder)
- [ ] Remove `url` property from `schema.prisma`
- [ ] Update Prisma Client instantiation with adapter
- [ ] Add both pooled and direct URLs to `.env` (if using pooled connections)
- [ ] Run `npx prisma generate` after setup
- [ ] Test database connection with a simple query

### 2. **Development Workflow**

**For Schema Changes:**
```bash
# 1. Edit schema.prisma
# 2. Sync to database
npx prisma db push

# 3. Regenerate client
npx prisma generate

# 4. Restart dev server
npm run dev
```

### 3. **Production Deployment**

```bash
# 1. Ensure you have direct database URL
DIRECT_DATABASE_URL="..."

# 2. Run migrations
npx prisma migrate deploy

# 3. Generate client
npx prisma generate

# 4. Start application
npm start
```

### 4. **Connection Management**

| Environment | Connection Type | Use Case |
|-------------|----------------|----------|
| **Development** | Pooled (`db push`) | Rapid iteration, no migrations needed |
| **Staging** | Direct (`migrate dev`) | Test migrations before production |
| **Production** | Pooled + Direct (`migrate deploy`) | Use pooled for app, direct for migrations |

### 5. **Migration Strategy**

**Development:**
- Use `prisma db push` for quick prototyping
- Creates/updates schema without migration files
- Perfect for local development

**Production:**
- Use `prisma migrate deploy`
- Applies migration files in order
- Maintains strict version control
- Requires direct database connection

### 6. **Troubleshooting Commands**

```bash
# Validate configuration and schema
npx prisma validate

# Check database connectivity
npx prisma db pull

# View current database schema
npx prisma studio --config ./prisma.config.ts

# Reset database (DANGEROUS - deletes all data)
npx prisma migrate reset

# View migration status
npx prisma migrate status

# Resolve failed migrations
npx prisma migrate resolve --applied <migration_name>
npx prisma migrate resolve --rolled-back <migration_name>
```

---

## Complete Guide

### Prisma 7 Configuration Reference

#### **prisma.config.ts Full Options**

```typescript
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  // Schema location (required)
  schema: 'prisma/schema.prisma',
  
  // Migrations configuration (optional)
  migrations: {
    path: 'prisma/migrations',
  },
  
  // Datasource configuration (required)
  datasource: {
    // Primary connection (required)
    url: env('DATABASE_URL'),
    
    // Direct connection for migrations (optional but recommended)
    directUrl: env('DIRECT_DATABASE_URL'),
    
    // Accelerate URL for Prisma Accelerate (optional)
    // accelerateUrl: env('ACCELERATE_URL'),
  },
  
  // Generator output path (optional)
  generator: {
    output: './generated/prisma-client',
  },
})
```

#### **schema.prisma Full Structure**

```prisma
// Generator configuration
generator client {
  provider = "prisma-client-js"
  // Optional: Custom output path
  // output = "../generated/prisma-client"
}

// Datasource configuration (NO url property in Prisma 7)
datasource db {
  provider = "postgresql"
  // ❌ url = env("DATABASE_URL")  // Don't include this
}

// Your models
model User {
  id    String @id @default(uuid())
  email String @unique
  // ... fields
}
```

#### **Prisma Client with Adapter**

```typescript
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

// Option 1: Simple connection string
const connectionString = process.env.DATABASE_URL
const adapter = new PrismaPg({ connectionString })

// Option 2: Using pg Pool (more control)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Maximum pool size
  idleTimeoutMillis: 30000,   // Close idle clients after 30s
  connectionTimeoutMillis: 2000, // Wait 2s for connection
})
const adapterWithPool = new PrismaPg({ pool })

// Instantiate Prisma Client
const prisma = new PrismaClient({ 
  adapter,
  log: ['query', 'error', 'warn'], // Optional logging
})

export { prisma }
```

### Database Adapters by Provider

| Database | Adapter Package | Driver Package |
|----------|----------------|----------------|
| PostgreSQL | `@prisma/adapter-pg` | `pg` |
| MySQL | `@prisma/adapter-mysql` | `mysql2` |
| SQLite | `@prisma/adapter-sqlite` | `better-sqlite3` |
| PlanetScale | `@prisma/adapter-planetscale` | `@planetscale/database` |
| Neon | `@prisma/adapter-neon` | `@neondatabase/serverless` |

### Environment Variables Template

```env
# ======================
# Database Configuration
# ======================

# Primary Database URL (with connection pooling)
DATABASE_URL="postgresql://username:password@host-pooler.provider.com:5432/database?sslmode=require"

# Direct Database URL (for migrations - no pooling)
DIRECT_DATABASE_URL="postgresql://username:password@host.provider.com:5432/database?sslmode=require"

# Prisma Accelerate (optional)
# ACCELERATE_URL="prisma://accelerate.prisma-data.net/?api_key=your_key"

# ======================
# Application Config
# ======================

NODE_ENV="development"
PORT=5000

# ... other environment variables
```

---

## Migration Checklist

### Pre-Migration

- [ ] Backup production database
- [ ] Document current Prisma version
- [ ] Review breaking changes for your version
- [ ] Test migration in development environment
- [ ] Ensure all team members are informed

### During Migration

- [ ] Update package.json dependencies
- [ ] Install new packages
- [ ] Create prisma.config.ts at project root
- [ ] Update schema.prisma (remove url)
- [ ] Update Prisma Client instantiation
- [ ] Baseline existing migrations (if needed)
- [ ] Generate Prisma Client
- [ ] Test database queries
- [ ] Update CI/CD scripts if needed

### Post-Migration

- [ ] Verify all database operations work
- [ ] Check query performance
- [ ] Update documentation
- [ ] Commit changes to version control
- [ ] Deploy to staging
- [ ] Deploy to production

---

## Common Pitfalls & Solutions

### Pitfall 1: Wrong Config File Location
**Problem:** Config file in wrong directory  
**Solution:** Must be at project root, not in `prisma/` folder

### Pitfall 2: Forgetting Adapter
**Problem:** Not using database adapter in Prisma Client  
**Solution:** Always instantiate adapter and pass to PrismaClient

### Pitfall 3: Using Old Commands
**Problem:** Using deprecated CLI flags  
**Solution:** Update to new command syntax (e.g., `--to-schema` instead of `--to-schema-datamodel`)

### Pitfall 4: Missing dotenv Import
**Problem:** Environment variables not loading  
**Solution:** Add `import 'dotenv/config'` at the top of `prisma.config.ts`

### Pitfall 5: Shadow Database Issues
**Problem:** Migrations fail with pooled connections  
**Solution:** Use direct URL or `db push` for development

---

## Additional Resources

### Official Documentation
- [Prisma 7 Announcement](https://www.prisma.io/blog/prisma-7)
- [Prisma Config Reference](https://www.prisma.io/docs/orm/reference/prisma-config)
- [Database Adapters](https://www.prisma.io/docs/orm/overview/databases/database-drivers)
- [Migration Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-to-prisma-7)

### Community Resources
- [Prisma Discord](https://discord.gg/prisma)
- [GitHub Discussions](https://github.com/prisma/prisma/discussions)
- [Stack Overflow Tag](https://stackoverflow.com/questions/tagged/prisma)

---

## Conclusion

Prisma 7 represents a significant evolution in how Prisma handles database connections and configuration. The separation of concerns between schema definition and connection configuration provides:

✅ **Benefits:**
- Cleaner schema files
- More flexible connection management
- Better support for different deployment environments
- Improved adapter system for various database drivers
- Enhanced type safety and developer experience

⚠️ **Considerations:**
- Requires migration effort for existing projects
- New file structure to learn
- Different approach for connection pooling scenarios
- Shadow database requirements for migrations

**Our Project Status:**  
✅ Successfully migrated to Prisma 7.1.0  
✅ Configuration validated and working  
✅ Database schema synchronized  
✅ Prisma Client generated and functional  

The migration process, while involving several steps and troubleshooting, ultimately results in a more maintainable and scalable database configuration that aligns with modern development practices.

---

**Document Version:** 1.0  
**Last Updated:** December 9, 2025  
**Project:** Academora_02  
**Author:** Development Team
