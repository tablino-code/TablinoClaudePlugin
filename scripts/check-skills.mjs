#!/usr/bin/env node
// Fails when a skill names a tool the Tablino MCP server does not expose.
//
//   node scripts/check-skills.mjs                      checks the skills against tools.json
//   node scripts/check-skills.mjs --server <checkout>  also checks tools.json against the tools declared in a Tablino
//                                                      checkout (src/server/Tablino.Mcp/Tools), so a renamed or removed
//                                                      tool fails here too
//   node scripts/check-skills.mjs --server <checkout> --write  rewrites tools.json from that checkout first
//
// A tool is named in a skill as a backticked snake_case word (`log_activity_time`) or in allowed-tools with the
// plugin prefix (mcp__plugin_tablino_tablino__log_activity_time). Other backticked words must not look like a tool name.

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const toolsFile = join(root, "tools.json");
const toolPrefix = "mcp__plugin_tablino_tablino__";
const toolWord = /^[a-z]+(?:_[a-z]+)*$/;

const args = process.argv.slice(2);
const serverIndex = args.indexOf("--server");
const serverRoot = serverIndex >= 0 ? args[serverIndex + 1] : null;
const write = args.includes("--write");
const errors = [];

function filesUnder(dir, suffix) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return filesUnder(path, suffix);
    return path.endsWith(suffix) ? [path] : [];
  });
}

function serverTools(checkout) {
  const toolsDir = join(checkout, "src", "server", "Tablino.Mcp", "Tools");
  const names = new Set();
  for (const file of filesUnder(toolsDir, ".cs")) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/\[McpServerTool\(\s*Name\s*=\s*"([^"]+)"/g)) names.add(match[1]);
  }
  if (names.size === 0) throw new Error(`No [McpServerTool] found under ${toolsDir}`);
  return [...names].sort();
}

if (write && !serverRoot) throw new Error("--write needs --server <Tablino checkout>");

if (serverRoot) {
  const declared = serverTools(serverRoot);
  if (write) writeFileSync(toolsFile, `${JSON.stringify({ tools: declared }, null, 2)}\n`);
  const listed = JSON.parse(readFileSync(toolsFile, "utf8")).tools;
  for (const name of listed.filter((tool) => !declared.includes(tool)))
    errors.push(`tools.json lists ${name}, which the server no longer declares`);
  for (const name of declared.filter((tool) => !listed.includes(tool)))
    errors.push(`the server declares ${name}, missing from tools.json (rerun with --write)`);
}

const tools = new Set(JSON.parse(readFileSync(toolsFile, "utf8")).tools);
const skills = filesUnder(join(root, "skills"), "SKILL.md");
if (skills.length === 0) errors.push("no skills/*/SKILL.md found");

for (const file of skills) {
  const text = readFileSync(file, "utf8");
  const where = relative(root, file).replaceAll("\\", "/");
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? "";
  const allowed = /^allowed-tools:\s*(.*)$/m.exec(frontmatter)?.[1] ?? "";
  let named = 0;

  for (const entry of allowed.split(/[\s,]+/).filter(Boolean)) {
    if (!entry.startsWith(toolPrefix)) {
      errors.push(`${where}: allowed-tools entry ${entry} is not a Tablino tool (${toolPrefix}<tool>)`);
      continue;
    }
    const tool = entry.slice(toolPrefix.length);
    named++;
    if (!tools.has(tool)) errors.push(`${where}: allowed-tools names ${tool}, which the server does not expose`);
  }

  for (const match of text.slice(frontmatter.length).matchAll(/`([^`\n]+)`/g)) {
    const word = match[1];
    if (!toolWord.test(word) || !(word.includes("_") || tools.has(word))) continue;
    named++;
    if (!tools.has(word)) errors.push(`${where}: names ${word}, which the server does not expose`);
  }

  if (named === 0) errors.push(`${where}: names no Tablino tool`);
}

if (errors.length > 0) {
  for (const error of errors) console.error(`error: ${error}`);
  process.exit(1);
}

console.log(`ok: ${skills.length} skills, every tool they name is one of the ${tools.size} tools in tools.json`);
