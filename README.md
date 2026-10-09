# Employee Hub

Employee Hub is a lightweight employee-management dashboard built with HTML, CSS, and vanilla JavaScript. It provides a responsive overview of a team, with search, filters, sorting, employee details, and in-session add/edit/delete interactions.

## Features

- Responsive dashboard layout with summary statistics and department breakdowns.
- Employee cards with profile images, role, department, contact details, and salary availability.
- Search by employee name, email, role, or department.
- Department and employment-status filters, plus name and salary sorting.
- Employee details and add/edit forms in modals.
- Client-side demo login, password visibility toggle, and logout.
- Loading, empty, API error, and toast feedback states.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts (Inter)
- [DummyJSON Users API](https://dummyjson.com/users?limit=30) for public sample employee records

No package manager, build step, or project dependencies are required.

## Run locally

The dashboard fetches data from a public API, so serve the project over HTTP rather than opening `index.html` directly with a `file://` URL.

### Python

From the project directory, run:

```powershell
py -m http.server 8000
```

Then open <http://localhost:8000/login.html>. Stop the server with `Ctrl+C`.

Alternatively, open the project in VS Code and use the Live Server extension.

## Demo login

This project has no backend authentication. Enter any valid-format email address and a non-empty password to start a local demo session, then the page redirects to the dashboard. Use **Log out** to clear that session and return to the login page.

This client-side demo is **not secure production authentication**. It does not verify accounts or passwords. Do not use real credentials. Production use requires a backend authentication service and server-side authorization.

## Data source and behavior

The dashboard requests up to 30 users from DummyJSON. It maps those public sample records to locally defined Indian display names and uses the API-provided email, department, role, and image. The dashboard currently maps all fetched employees to `Active`.

The API does not provide payroll information used by this dashboard, so salaries for fetched employees are displayed as **Not available** and the average salary statistic shows `—` until salary values are entered. No salary is fabricated.

Add, edit, and delete actions update only the current page's in-memory list. They are lost on refresh; there is no database or persistent storage. The included `data/employees.json` is sample project data and is not the live dashboard data source.

## Current limitations

- Demo login is entirely frontend-only and provides no real identity verification or security boundary.
- Employee data depends on network access to the public DummyJSON API.
- API user records are sample data; display names and active status are dashboard-side demo mappings.
- Dashboard employee changes do not persist after refresh.
- Salary values are not available from the current API integration.
- There is no backend, database, automated test suite, or production deployment configuration.

## Project structure

```text
.
├── css/
│   ├── login.css
│   └── style.css
├── data/
│   └── employees.json
├── js/
│   ├── api.js
│   ├── app.js
│   ├── auth.js
│   └── employees.js
├── index.html
└── login.html
```
