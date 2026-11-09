import { watch } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";

const execFileAsync = promisify(execFile);
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const watchedPaths = [
  ".gitignore",
  "index.html",
  "package.json",
  "package-lock.json",
  "postcss.config.js",
  "tailwind.config.js",
  "tsconfig.json",
  "tsconfig.node.json",
  "vite.config.ts",
  "src/",
  "public/",
  ".vscode/tasks.json",
  "scripts/auto-push.mjs",
];
const ignoredPathParts = new Set([".git", "node_modules", "dist", "coverage"]);

let debounceTimer;
let running = false;
let rerunRequested = false;

function isWatchedPath(filename) {
  const normalized = filename.replaceAll("\\", "/");
  if (
    normalized.split("/").some((part) => ignoredPathParts.has(part)) ||
    normalized.endsWith(".log") ||
    normalized.endsWith("~") ||
    normalized.includes("/.env")
  ) {
    return false;
  }

  return watchedPaths.some(
    (watchedPath) =>
      watchedPath.endsWith("/")
        ? normalized.startsWith(watchedPath)
        : normalized === watchedPath,
  );
}

async function git(args) {
  const { stdout, stderr } = await execFileAsync("git", args, {
    cwd: projectRoot,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  if (stderr.trim()) {
    process.stderr.write(stderr);
  }
  return stdout.trim();
}

function formatCommitMessage(files) {
  if (files.length > 1) {
    return `chore(auto-push): update ${files.length} project files`;
  }

  const [file] = files;
  const page = file.match(/^src\/pages\/([^/]+)\/(.+)\.[^.]+$/);
  if (page) {
    const title = page[2]
      .split("/")
      .at(-1)
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .toLowerCase();
    return `feat(${page[1]}): update ${title}`;
  }

  const area = file.startsWith("src/components/")
    ? "ui"
    : file.startsWith("src/services/")
      ? "api"
      : file.startsWith("src/")
        ? "core"
        : "project";
  const title = path
    .basename(file, path.extname(file))
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase();
  return `chore(${area}): update ${title}`;
}

async function commitAndPush() {
  if (running) {
    rerunRequested = true;
    return;
  }
  running = true;

  try {
    const stagedBefore = await git(["diff", "--cached", "--name-only"]);
    if (stagedBefore) {
      throw new Error(
        "Changes are already staged. Commit or unstage them before auto-push can continue.",
      );
    }

    await git(["add", "-A", "--", ...watchedPaths]);
    const stagedFiles = await git(["diff", "--cached", "--name-only"]);
    if (!stagedFiles) {
      return;
    }

    const files = stagedFiles.split("\n");
    const message = formatCommitMessage(files);

    await git(["commit", "-m", message]);
    await git(["push", "origin", "HEAD"]);
    console.log(`Committed and pushed: ${message}`);
  } catch (error) {
    const detail =
      error && typeof error === "object" && "stderr" in error
        ? String(error.stderr).trim()
        : "";
    console.error(
      `Auto-push failed: ${error instanceof Error ? error.message : String(error)}${detail ? `\n${detail}` : ""}`,
    );
  } finally {
    running = false;
    if (rerunRequested) {
      rerunRequested = false;
      scheduleCommit();
    }
  }
}

function scheduleCommit() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    void commitAndPush();
  }, 1500);
}

function watchDirectory(relativeDirectory, recursive) {
  const directory = path.join(projectRoot, relativeDirectory);
  const watcher = watch(directory, { recursive }, (_eventType, filename) => {
    if (!filename) {
      return;
    }

    const relativeFilename = path
      .join(relativeDirectory, filename.toString())
      .replaceAll("\\", "/");
    if (isWatchedPath(relativeFilename)) {
      scheduleCommit();
    }
  });

  watcher.on("error", (error) => {
    console.error(`Auto-push watcher failed for ${relativeDirectory}: ${error.message}`);
  });
}

try {
  watchDirectory(".", false);
  watchDirectory("src", true);
  watchDirectory("public", true);
  watchDirectory(".vscode", false);
  watchDirectory("scripts", false);
  console.log("Watching project code and assets; changes push after 1.5 seconds of inactivity.");
  scheduleCommit();
} catch (error) {
  console.error(
    `Could not start auto-push watcher: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
}
