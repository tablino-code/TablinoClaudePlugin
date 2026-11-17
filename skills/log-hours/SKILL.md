---
name: log-hours
description: Logs hours in Tablino on Activities or Project Phases, for one day or a whole week, looking up every record by name. Use when the user wants to log, record or fill in time, hours or a timesheet in Tablino.
argument-hint: "[what you worked on, hours and days]"
allowed-tools: mcp__plugin_tablino_tablino__whoami mcp__plugin_tablino_tablino__search_activities mcp__plugin_tablino_tablino__get_activity mcp__plugin_tablino_tablino__search_projects mcp__plugin_tablino_tablino__get_project mcp__plugin_tablino_tablino__get_project_phase
---
# Log hours in Tablino

Log the hours the user describes: $ARGUMENTS

When nothing was described, ask what they worked on, for how long and on which days (this week by default).

1. Call `whoami` to get the user's id.
2. For each piece of work, find where the time belongs:
   - `search_activities` with the user's id as assigneeUserId and words of the work as text, limited to the days worked with scheduledFrom and scheduledTo when that helps.
   - When the work names a Project, `search_projects` and then `get_project` to see its Phases; `get_project_phase` shows a Phase's logged hours.
3. Build one table before writing anything: day (yyyy-MM-dd), record (Activity or Project Phase), hours and a short description. Mark every line whose record is ambiguous or missing and ask about it; never guess an id.
4. After the user confirms the table, log each line:
   - on an Activity with `log_activity_time` (minutes = hours x 60, workDate = the day);
   - on a Project Phase with no Activity of the user with `log_project_time`.
5. Answer with what was logged (record, day, hours and time entry id) and the lines that failed with Tablino's reason.

Rules: Tablino refuses more than 1440 minutes in one entry and consolidated or locked work; report the refusal instead of retrying. After an "outcome unknown" error, search the record's time entries with `get_activity` or `get_project_phase` before logging again.
