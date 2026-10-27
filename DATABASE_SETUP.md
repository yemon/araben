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

### 7. Seed the Learning Content

```bash
npm run db:seed-content -- --dry-run   # check the content files; writes nothing
npm run db:seed-content
```

This copies everything in `content/*.json` (words, surahs, basics, scenarios,
hidden words, roots) into the content tables. It only touches those tables —
never the trace game ones — and it is safe to run again:

- It checks every file first (unknown fields, broken links between files,
  duplicate slugs, text too long for its column) and writes nothing if
  anything is wrong.
- It writes in one transaction, then rebuilds every JSON file from the
  database and compares. Any difference rolls the whole seed back.
- Rows are matched by slug, so re-seeding keeps their ids. Rows no longer in
  the files are removed.

`arabic-complete-guide.md` stays the source of truth. After editing it, run
`npm run content:sync` — it re-parses the guide into `content/*.json` and
seeds the database. Nothing else needs it: `npm run dev` and `npm run build`
read the database as it is.

## How the Site Reads Content

```
arabic-complete-guide.md ──parse──▶ content/*.json ──db:seed-content──▶ MySQL ──▶ pages
                         └───────────── npm run content:sync ─────────────┘
```

- Every page gets its content through `src/lib/content.ts` (`getAllWords()`,
  `getSurah(slug)`, …). It loads the whole content set from the database in
  one go and returns it in the same shapes the JSON files have, so pages and
  components don't know where it came from.
- Pages are still rendered ahead of time by `next build`, so **the build needs
  the database** (with the content seeded) to be reachable.
- Content pages re-read the database at most every 5 minutes
  (`export const revalidate = 300`). After re-seeding a running site, changes
  appear within about 5 minutes without a rebuild, and a word, surah or
  scenario added since the build gets its page on first visit.
- `npm run dev` and `npm run build` neither parse nor seed. Seed the
  production database deliberately, then build or let pages revalidate.

## Admin Panel

`/admin` manages scenarios, surahs, the Hidden in Bangla words and lists, and
the trace game. Alphabet, grammar, basics and roots aren't edited there; they
still come from the guide.

### Set up sign-in

1. Put `NEXTAUTH_URL` and `NEXTAUTH_SECRET` in `.env` (see `.env.example`).
2. Create an admin. You'll be asked for a password (10 characters or more):

   ```bash
   npm run admin:create -- you@example.com --name "Your Name"
   ```

   Run it again with the same email to reset the password.
3. Sign in at `/admin/login`.

### How it's protected

- `src/proxy.ts` sends anyone without a valid session to the sign-in page,
  answers admin API calls with 401, and refuses admin writes sent from
  another site.
- Every admin page and API route checks the session again on the server
  (`src/lib/admin/session.ts`).
- Passwords are bcrypt hashes. Sessions are signed, httpOnly cookies that last
  8 hours. After 5 wrong passwords an email is locked out for 15 minutes.

### Saving content

- Saving a scenario, surah or hidden-word category also updates the word
  index, the way the parser would: words are matched by their exact Arabic
  and transliteration, new ones are created, and words that no longer appear
  anywhere are removed. An existing word's meaning is never changed by a save.
- The public pages show a change straight away.
- Every change is recorded in `content_edits` and listed on the dashboard.

### Scenario videos

A scenario can have any number of videos illustrating its dialogue. They
are shown above the dialogue on its page; with more than one, buttons switch
between them.

- Upload them at the bottom of a scenario's edit page (`/admin/scenarios/edit/<id>`).
  MP4, WebM or Ogg, up to 500 MB each. Give each a title — it labels its
  switch button — and put them in order there.
- Files are stored in `uploads/scenario-videos/` in the project folder, under
  generated names; `scenario_videos` holds their order, title and original
  file name. They are served at `/media/scenario-videos/<file>`.
- **The videos are not in git** (only the empty folder is). Back up
  `uploads/` along with the database, and give the server a persistent disk
  — on a host whose disk is wiped on each deploy, the videos would be lost.
- Deleting a video, or its scenario, deletes the file too. The content seed
  leaves videos alone.

### The admin and the guide

Once content is edited in the admin, the database is ahead of
`arabic-complete-guide.md`. `npm run content:sync` would undo those edits, so
it refuses and lists them. Add `--force` only if you mean to throw them away
and reload everything from the guide:

```bash
npm run db:seed-content -- --force
```

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

### Learning content

| Table | From |
| --- | --- |
| `words`, `word_appearances` | `words.json` |
| `surahs`, `surah_verses` | `surahs.json` |
| `basics_categories`, `basics_category_words`, `basics_dialogues`, `basics_dialogue_turns` | `basics.json` |
| `scenarios`, `scenario_turns` | `scenarios.json` |
| `hidden_categories`, `hidden_entries`, `hidden_persian_words`, `hidden_mixed_words`, `hidden_english_words` | `hidden.json` |
| `roots`, `root_family_members` | `roots.json` |
| `content_syncs` | one row per seed, recording which `manifest.json` it loaded |

### Admin

| Table | Holds |
| --- | --- |
| `admin_users` | who may sign in (email, bcrypt password hash) |
| `content_edits` | every change made in the admin panel |
| `scenario_videos` | each scenario's videos (files in `uploads/scenario-videos/`) |

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

# After editing arabic-complete-guide.md: re-parse it and re-seed the content
npm run content:sync

# Re-seed the learning content from content/*.json as they are
npm run db:seed-content

# Create an admin, or reset an admin's password
npm run admin:create -- you@example.com
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

Once the database is set up and an admin exists, sign in at `/admin` to manage
scenarios, surahs, the Hidden in Bangla words and the trace game.
