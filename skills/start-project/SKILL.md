---
name: start-project
description: Opens a Tablino Project from a Quotation, approving an existing pending or sent Quotation or creating one for the Client first. Use when the user wants to start, open or create a Project, or approve a Quotation, in Tablino.
argument-hint: "[Client, service, amount or Quotation]"
allowed-tools: mcp__plugin_tablino_tablino__search_contacts mcp__plugin_tablino_tablino__get_contact mcp__plugin_tablino_tablino__search_quotations mcp__plugin_tablino_tablino__list_project_types mcp__plugin_tablino_tablino__list_payment_types mcp__plugin_tablino_tablino__get_project
---
# Start a Project from a Quotation

Start the Project the user describes: $ARGUMENTS

1. Find the Client with `search_contacts` (type Client); when several match, or none, show what was found and ask.
2. Look for the Client's open Quotations with `search_quotations` (the Client's id as clientId, status pending and then sent).
   - When one fits the request, use it and go to step 5.
   - When several fit, show them and ask which one.
3. To create a Quotation, read the Client with `get_contact` and take its Additional Contact as the follow-up person; when it has none, ask the user for one and add it with `add_additional_contact`. Pick the quotation type with `list_project_types` and the payment type with `list_payment_types`; ask when more than one fits. Ask for the total amount when it was not given.
4. Create it with `create_quotation`: one item for the service with the total amount, and installments summing to that total.
5. Show the Quotation (Client, service, total, installments) and ask for an explicit confirmation. Only after the user confirms, approve it with `approve_quotation`, passing the Project name when the user gave one.
6. Read the new Project with `get_project` and answer with its id, name, Client and Phases.

Rules: approving creates a Project and cannot be undone from here; never approve without the user's confirmation in this conversation. After an "outcome unknown" error on the approval, read the Quotation's status with `search_quotations` before trying again.
