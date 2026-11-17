---
name: organize-activities
description: Organizes the user's Tablino Activities for a week - what is scheduled, what is late, a day-by-day plan - and applies the changes the user accepts (reschedule, status, new Activities). Use when the user wants to plan the week, organize, reschedule or close their Activities or tasks in Tablino.
argument-hint: "[week start yyyy-MM-dd or what to organize]"
allowed-tools: mcp__plugin_tablino_tablino__whoami mcp__plugin_tablino_tablino__search_activities mcp__plugin_tablino_tablino__get_activity mcp__plugin_tablino_tablino__list_activity_categories mcp__plugin_tablino_tablino__search_projects
---
# Organize my Activities

Organize the user's Tablino Activities: $ARGUMENTS

The week runs from Monday to Sunday; use this week when no date was given.

1. Call `whoami` to get the user's id.
2. List the week's Activities with `search_activities`: the user's id as assigneeUserId, scheduledFrom the Monday and scheduledTo the Sunday.
3. List what is late with `search_activities`: the user's id, scheduledTo the day before the Monday, status todo and then inProgress.
4. Read an Activity with `get_activity` only when its checklist or estimate changes the plan.
5. Propose a day-by-day plan that fits the late work in, with each Activity's estimate when it has one, and list the changes it needs: new dates, status changes, new Activities.
6. Change nothing until the user confirms. Then apply only what they accepted:
   - move an Activity with `reschedule_activity`;
   - mark finished work done, or started work inProgress, with `set_activity_status`;
   - create a missing Activity with `create_activity` (`list_activity_categories` gives the category ids; `search_projects` the Project when it belongs to one);
   - change a title, estimate or responsible User with `update_activity`.
7. Answer with the final plan and every change made.

Rules: never delete an Activity from this skill; when the user asks for it, confirm the exact Activity first and use `delete_activity`.
