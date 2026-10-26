/**
 * Create an admin account, or reset an existing admin's password.
 *
 *   npm run admin:create -- you@example.com
 *   npm run admin:create -- you@example.com --name "Your Name"
 *
 * The password is asked for twice and never echoed. Where there is no
 * terminal to ask in (a deploy script, say), it is read from ADMIN_PASSWORD.
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const MIN_LENGTH = 10;

const args = process.argv.slice(2);
const email = (args.find((a) => !a.startsWith("--")) ?? "").trim().toLowerCase();
const nameAt = args.indexOf("--name");
const name = nameAt >= 0 ? args[nameAt + 1]?.trim() || null : undefined;

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Usage: npm run admin:create -- <email> [--name \"Name\"]");
  process.exit(1);
}

// Read a line from the terminal without echoing it.
function askHidden(question) {
  return new Promise((resolve, reject) => {
    const { stdin, stdout } = process;
    stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    const onData = (ch) => {
      if (ch === "\r" || ch === "\n" || ch === "\u0004") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener("data", onData);
        stdout.write("\n");
        resolve(value);
      } else if (ch === "\u0003") {
        stdin.setRawMode(false);
        reject(new Error("Cancelled"));
      } else if (ch === "\u007f" || ch === "\b") {
        value = value.slice(0, -1);
      } else {
        value += ch;
      }
    };
    stdin.on("data", onData);
  });
}

async function readPassword() {
  if (!process.stdin.isTTY) return process.env.ADMIN_PASSWORD ?? "";
  const first = await askHidden("Password: ");
  const second = await askHidden("Repeat it: ");
  if (first !== second) throw new Error("The passwords don't match");
  return first;
}

const prisma = new PrismaClient();

async function main() {
  const password = await readPassword();
  if (password.length < MIN_LENGTH) {
    throw new Error(
      process.stdin.isTTY
        ? `Use at least ${MIN_LENGTH} characters`
        : `Set ADMIN_PASSWORD (at least ${MIN_LENGTH} characters) when running without a terminal`,
    );
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, ...(name !== undefined ? { name } : {}) },
    create: { email, passwordHash, name: name ?? null },
  });
  console.log(existing ? `✓ Password reset for ${email}` : `✓ Admin created: ${email}`);
}

main()
  .catch((e) => {
    console.error(`❌ ${e.message ?? e}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
