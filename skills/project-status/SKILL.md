---
name: project-status
description: Summarizes a Tablino Project without changing anything - status, Client, Phases and deadlines, hours per Phase, open and late Activities, Quotations and Installments. Use when the user asks how a Project is going, its status, hours or next deadlines in Tablino.
argument-hint: "[Project name]"
allowed-tools: mcp__plugin_tablino_tablino__search_projects mcp__plugin_tablino_tablino__get_project mcp__plugin_tablino_tablino__get_project_phase mcp__plugin_tablino_tablino__search_activities mcp__plugin_tablino_tablino__search_quotations
---
# Project status

Summarize the Tablino Project: $ARGUMENTS

This skill only reads; it changes nothing.

1. Find the Project with `search_projects`; when several match, show the candidates and ask which one.
2. Read it with `get_project`: status, Client, Phases with deadlines, amounts and Installments.
3. For each Phase not yet delivered, read its hours with `get_project_phase`.
4. List its open Activities with `search_activities` (its projectId, status todo and then inProgress).
5. List the Client's Quotations with `search_quotations` (the Client's id as clientId).
6. Answer with a short summary: where the Project stands, the next deadlines, hours logged per Phase, open and late Activities, and the open Installments.

A value Tablino answers as null is hidden by the user's Permissions: say so and never estimate it.
