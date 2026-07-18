# API Reference

Base URL: `http://localhost:5000/api`

Auth: session is a JWT stored in an httpOnly cookie named `token`, set by `POST /auth/login`. All protected routes require this cookie (sent automatically by the browser / axios with `withCredentials: true`). No `Authorization` header is used.

Roles: `SUPER_ADMIN`, `HR_MANAGER`, `EMPLOYEE`.

Error responses follow this shape:
```json
{ "success": false, "message": "..." }
```
Validation errors (Zod) additionally include an `errors` array of `{ path, message }`.

---

## Auth

### `POST /auth/login`
Auth: none.
Body:
```json
{ "email": "admin@ems.com", "password": "admin123" }
```
Response `200`:
```json
{
  "success": true,
  "message": "Login successful",
  "user": { "id": "...", "email": "admin@ems.com", "role": "SUPER_ADMIN" }
}
```
Sets the `token` cookie. `401` on invalid credentials.

### `POST /auth/logout`
Auth: none (clears cookie regardless).
Response `200`: `{ "success": true, "message": "Logged out successfully" }`

### `GET /auth/me`
Auth: any authenticated user.
Response `200`: `{ "success": true, "user": { "_id": "...", "email": "...", "role": "...", "employee": "..." } }`

---

## Employees — Self-service

### `GET /employees/me`
Auth: any authenticated user (must have a linked `Employee` via `User.employee`).
Response `200`: `{ "success": true, "data": <Employee> }`
`404` if no employee is linked to the account.

### `PATCH /employees/me`
Auth: any authenticated user.
Content-Type: `multipart/form-data` (for optional photo upload).
Body (whitelisted fields only — everything else is ignored/rejected):
```json
{ "phone": "9998887777" }
```
Response `200`: `{ "success": true, "message": "Profile updated successfully", "data": <Employee> }`

---

## Employees — Admin CRUD

### `POST /employees`
Auth: `SUPER_ADMIN`, `HR_MANAGER`. Only `SUPER_ADMIN` may set `role: "SUPER_ADMIN"` (`403` otherwise).
Content-Type: `multipart/form-data`.
Body:
```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "phone": "9998887777",
  "department": "Engineering",
  "designation": "SDE II",
  "salary": 90000,
  "joiningDate": "2024-01-15",
  "role": "EMPLOYEE",
  "reportingManager": "<optional employee _id>",
  "photo": "<file, optional>"
}
```
Response `201`: `{ "success": true, "message": "Employee created successfully", "data": <Employee> }`
`400` on validation failure (bad email, negative salary, invalid role, etc).

### `GET /employees`
Auth: `SUPER_ADMIN`, `HR_MANAGER`.
Query params: `page`, `limit`, `search` (matches name/email), `department`, `status`, `role`, `sortBy`, `order` (`asc`/`desc`).
Response `200`:
```json
{
  "success": true,
  "data": [ <Employee>, ... ],
  "pagination": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}
```

### `GET /employees/:id`
Auth: `SUPER_ADMIN`, `HR_MANAGER`. `:id` is the Mongo `_id`.
Response `200`: `{ "success": true, "data": { "employee": <Employee>, "reportees": [<Employee summary>] } }`

### `PATCH /employees/:id`
Auth: `SUPER_ADMIN`, `HR_MANAGER`. Only `SUPER_ADMIN` may set `role: "SUPER_ADMIN"`.
Content-Type: `multipart/form-data`. Body: any subset of the create fields.
Response `200`: `{ "success": true, "message": "Employee updated successfully", "data": <Employee> }`

### `DELETE /employees/:id`
Auth: `SUPER_ADMIN` only. Soft delete (`isDeleted = true`).
Response `200`: `{ "success": true, "message": "Employee deleted successfully" }`

---

## Organizational Hierarchy

### `GET /employees/organization/tree`
Auth: `SUPER_ADMIN`, `HR_MANAGER`.
Response `200`: `{ "success": true, "data": [ { "_id", "employeeId", "name", "designation", "department", "children": [...] }, ... ] }` — nested tree rooted at employees with no manager.

### `GET /employees/:id/reportees`
Auth: `SUPER_ADMIN`, `HR_MANAGER`. `:id` is the Mongo `_id` of the manager.
Response `200`: `{ "success": true, "count": 3, "data": [<Employee>, ...] }`

### `PATCH /employees/:id/manager`
Auth: `SUPER_ADMIN` only.
Body: `{ "managerId": "<employee _id>" }`
Response `200`: `{ "success": true, "message": "Reporting manager assigned successfully", "data": <Employee> }`
`400` if the employee would report to themselves or a circular chain would result (walks up the manager chain server-side).

---

## Dashboard

### `GET /dashboard/stats`
Auth: `SUPER_ADMIN`, `HR_MANAGER`.
Response `200`:
```json
{
  "success": true,
  "data": {
    "totalEmployees": 42,
    "activeEmployees": 38,
    "inactiveEmployees": 4,
    "departmentCount": 5,
    "averageSalary": 68000
  }
}
```

---

## HTTP status codes

| Code | Meaning |
|---|---|
| 200/201 | Success |
| 400 | Validation error (Zod) or bad request (e.g. circular reporting) |
| 401 | Not authenticated (missing/invalid token) |
| 403 | Authenticated but not authorized for this action/role |
| 404 | Resource not found |
| 500 | Unexpected server error |
