# Tablino plugin for Claude Code

Connects Claude Code to your [Tablino](https://github.com/tablino-code) Office through the Tablino MCP server and adds four skills
for the everyday work of an architecture office. Claude sees and changes only what your Tablino Permissions allow, and you can
disconnect it at any time in Tablino.

## Skills

| Skill | What it does |
| --- | --- |
| `/tablino:log-hours` | Logs hours on Activities or Project Phases for a day or a whole week, confirming a table before writing. |
| `/tablino:start-project` | Opens a Project from a Quotation: approves an open Quotation of the Client, or creates one first, after your confirmation. |
| `/tablino:organize-activities` | Plans your week from scheduled and late Activities and applies the changes you accept. |
| `/tablino:project-status` | Summarizes a Project: Phases, deadlines, hours, open Activities, Quotations and Installments. Read only. |

Claude also picks a skill on its own when your request matches it, for example "log my hours of this week in Tablino".

## Install

You need a Tablino Office account and your **Tablino address for AI**: in Tablino, open My Tablino > AI + Tablino and copy it.

1. In Claude Code, add the marketplace and install the plugin:

   ```
   /plugin marketplace add tablino-code/tablino-claude-plugin
   /plugin install tablino@tablino
   ```

   When asked for **Tablino address for AI**, paste the address you copied.
2. Restart Claude Code, type `/mcp`, choose `tablino` and authenticate: Tablino opens in the browser, you sign in and choose Allow.
3. Try it: `/tablino:project-status <a Project name>`.

From a terminal, the same install is
`claude plugin install tablino@tablino --marketplace tablino-code/tablino-claude-plugin --config mcp_url=<your address>`.

To disconnect, open My Tablino > AI + Tablino and choose Disconnect, or uninstall the plugin with `/plugin uninstall tablino@tablino`.

## Privacy

The plugin holds no data and no credentials: Claude Code talks to your Tablino through OAuth, and every call runs with your own
Tablino Permissions. Tablino's privacy policy applies to the data Claude reads and writes.

## Contributing

Each skill names Tablino MCP tools in backticks (`log_activity_time`) and lists its read-only tools in `allowed-tools`
(`mcp__plugin_tablino_tablino__<tool>`), so Claude Code does not ask before reading. Writes always ask. `tools.json` lists the tools
the server exposes. Before every commit:

```
node scripts/check-skills.mjs
```

It fails when a skill names a tool missing from `tools.json`. With a Tablino checkout, it also fails when `tools.json` no longer
matches the server (a tool renamed or removed); `--write` refreshes the list:

```
node scripts/check-skills.mjs --server <path to the Tablino repository>
node scripts/check-skills.mjs --server <path to the Tablino repository> --write
```

Then validate the manifests with `claude plugin validate .`.

## License

[MIT](LICENSE)
