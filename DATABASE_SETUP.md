# Araben Database Setup

This guide will help you set up the MySQL database for the trace game feature in araben.

## Prerequisites

- MySQL server installed and running on your machine
- Node.js and npm installed

## Setup Steps

### 1. Create MySQL Database

Open your MySQL client (MySQL Workbench, command line, or phpMyAdmin) and run:

```sql
CREATE DATABASE araben CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Database Connection

Update the `.env` file in the root directory with your MySQL credentials:

```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/araben"
```

Replace:
- `USERNAME` with your MySQL username (usually `root` for local development)
- `PASSWORD` with your MySQL password (leave empty if no password: `root:@localhost`)

Example:
```env
# No password
DATABASE_URL="mysql://root:@localhost:3306/araben"

# With password
DATABASE_URL="mysql://root:mypassword@localhost:3306/araben"
```

### 3. Install Dependencies

```bash
npm install
```

This will install:
- `@prisma/client` - Prisma client for database queries
- `prisma` - Prisma CLI for migrations

### 4. Generate Prisma Client

```bash
npm run db:generate
```

This generates the TypeScript types for your database schema.

### 5. Push Schema to Database

```bash
npm run db:push
```

This creates the tables in your MySQL database based on the schema.

### 6. Seed the Database

```bash
npm run db:seed
```

This populates the database with:
- Game type (word-trace)
- 20 sample Arabic words for the trace game

## Database Schema

The trace game uses 3 tables:

### `game_types`
- Stores game type metadata
- Currently only has "word-trace"

### `games`
- Stores each Arabic word as a game
- Fields: slug, title, description, status, difficulty

### `game_slides`
- Stores the actual word data as JSON
- Format: `{ word: "سلام", language: "ar" }`

## Useful Commands

```bash
# View your database in the browser
npm run db:studio

# Create a new migration
npm run db:migrate

# Push schema changes without migration
npm run db:push

# Generate Prisma client after schema changes
npm run db:generate

# Re-seed the database
npm run db:seed
```

## Troubleshooting

### Connection Refused

If you get a connection error:
1. Make sure MySQL is running
2. Check your credentials in `.env`
3. Verify the database `araben` exists

### Port Already in Use

If port 3306 is in use:
- Update the port in your `DATABASE_URL`
- Example: `mysql://root:@localhost:3307/araben`

### Character Encoding Issues

Make sure your database uses UTF-8:
```sql
ALTER DATABASE araben CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Next Steps

Once the database is set up:
1. The trace game API routes will be able to query words
2. You can add more Arabic words through Prisma Studio or the admin interface
3. All trace game data is now managed through the database instead of JSON files
