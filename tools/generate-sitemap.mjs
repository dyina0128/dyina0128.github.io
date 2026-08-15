import { execFileSync } from "node:child_process";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = "https://dyina0128.github.io/";
const excluded = new Set([
  "google9a37b7e5e6d98f1c.html",
  "naverd8023812e149436cdeb649ab5599a315.html",
]);

const entries = await readdir(root, { withFileTypes: true });
const candidatePages = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
  .map((entry) => entry.name)
  .filter((name) => !excluded.has(name))
  .sort((left, right) => {
    if (left === "index.html") return -1;
    if (right === "index.html") return 1;
    return left.localeCompare(right, "en");
  });

const pages = [];
for (const name of candidatePages) {
  const html = await readFile(path.join(root, name), "utf8");
  if (!/<meta\s+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) {
    pages.push(name);
  }
}

const history = execFileSync(
  "git",
  ["log", "--format=DATE:%cs", "--name-only", "--", "*.html"],
  { cwd: root, encoding: "utf8" },
);
const lastModified = new Map();
let commitDate = "";
for (const line of history.split("\n")) {
  if (line.startsWith("DATE:")) {
    commitDate = line.slice(5);
  } else if (line.endsWith(".html") && !lastModified.has(line)) {
    lastModified.set(line, commitDate);
  }
}

const changed = new Set(
  execFileSync("git", ["status", "--porcelain"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean)
    .map((line) => line.slice(3).trim()),
);
const today = new Date().toISOString().slice(0, 10);

const urls = await Promise.all(
  pages.map(async (name) => {
    const lastmod = changed.has(name) ? today : lastModified.get(name) || today;
    const location = name === "index.html" ? baseUrl : `${baseUrl}${name}`;
    return [
      "    <url>",
      `        <loc>${location}</loc>`,
      `        <lastmod>${lastmod}</lastmod>`,
      "    </url>",
    ].join("\n");
  }),
);

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls,
  "</urlset>",
  "",
].join("\n");

await writeFile(path.join(root, "sitemap.xml"), sitemap, "utf8");
console.log(`Generated sitemap.xml with ${pages.length} pages.`);
