import { watch } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";

const execFileAsync = promisify(execFile);
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const watchedPaths = [
  ".gitignore",
  "docker-compose.yml",
  "frontend/",
  "README.md",
  "docs/",
  ".github/",
  "backend/app/",
  "backend/alembic/",
  "backend/tests/",
  "backend/.env.example",
  "backend/.dockerignore",
  "backend/Dockerfile",
  "backend/requirements.txt",
  "backend/alembic.ini",
  "backend/pytest.ini",
  ".vscode/tasks.json",
  "scripts/auto-push.mjs",
];
const ignoredPathParts = new Set([
  ".git",
  "node_modules",
  "dist",
  "coverage",
  ".venv",
  "venv",
  "__pycache__",
  ".pytest_cache",
  ".mypy_cache",
  "uploads",
]);

let debounceTimer;
let running = false;
let rerunRequested = false;

function isWatchedPath(filename) {
  const normalized = filename.replaceAll("\\", "/");
  const pathParts = normalized.split("/");
  if (
    pathParts.some(
      (part) =>
        ignoredPathParts.has(part) ||
        (part.startsWith(".env") && part !== ".env.example"),
    ) ||
    normalized.endsWith(".log") ||
    normalized.endsWith("~")
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
  if (files.length === 1) {
    const [file] = files;
    const page = file.match(/^frontend\/src\/pages\/([^/]+)\/(.+)\.[^.]+$/);
    if (page) {
      const title = path
        .basename(page[2])
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .toLowerCase();
      return `feat(${page[1]}): update ${title}`;
    }

    if (file === "README.md") {
      return "docs: update the project README";
    }
    if (file.startsWith("backend/alembic/")) {
      return "db: update database migrations";
    }
    if (file.startsWith("backend/tests/")) {
      return "test(backend): update backend coverage";
    }
    if (file.startsWith("backend/app/core/security")) {
      return "feat(auth): update backend security utilities";
    }
    if (file.startsWith("backend/app/")) {
      return "feat(api): update backend application";
    }
    if (file.startsWith("backend/")) {
      return "build(backend): update backend configuration";
    }
    if (file.startsWith(".github/")) {
      return "ci: update GitHub Actions workflow";
    }
    if (file === "docker-compose.yml" || file.endsWith("/Dockerfile")) {
      return "build: update local container setup";
    }
    if (file.startsWith("docs/")) {
      return "docs: update project documentation";
    }

    const area = file.startsWith("frontend/src/components/")
      ? "ui"
      : file.startsWith("frontend/src/services/")
        ? "api"
        : file.startsWith("frontend/src/")
          ? "core"
          : "project";
    const title = path
      .basename(file, path.extname(file))
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .toLowerCase();
    return `chore(${area}): update ${title}`;
  }

  if (files.every((file) => file.startsWith("backend/alembic/"))) {
    return "db: update database migrations";
  }
  if (files.every((file) => file.startsWith("backend/tests/"))) {
    return "test(backend): update backend test coverage";
  }
  if (files.every((file) => file.startsWith("backend/"))) {
    return "feat(backend): update API, security, and data models";
  }
  if (files.every((file) => file.startsWith("docs/") || file === "README.md")) {
    return "docs: update project guides";
  }
  if (files.every((file) => file.startsWith("frontend/src/pages/"))) {
    return "feat(app): update application pages";
  }
  if (files.every((file) => file.startsWith("frontend/src/"))) {
    return "chore(app): update shared application code";
  }
  return "chore(project): update application and project files";
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

    const existingPaths = [];
    for (const watchedPath of watchedPaths) {
      const trackedOrUntracked = await git([
        "ls-files",
        "--cached",
        "--others",
        "--exclude-standard",
        "--",
        watchedPath,
      ]);
      if (trackedOrUntracked) {
        existingPaths.push(watchedPath);
      }
    }
    if (existingPaths.length === 0) {
      return;
    }

    await git(["add", "-A", "--", ...existingPaths]);
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
  watchDirectory("frontend", true);
  watchDirectory("backend", true);
  watchDirectory("docs", true);
  watchDirectory(".vscode", false);
  watchDirectory("scripts", false);
  watchDirectory(".github", true);
  console.log("Watching project code and assets; changes push after 1.5 seconds of inactivity.");
  scheduleCommit();
} catch (error) {
  console.error(
    `Could not start auto-push watcher: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exitCode = 1;
}
