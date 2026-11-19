# NeuroNest — REST API Documentation

## 1. Base URL & Protocol
- **Local Development**: `http://localhost:8080/api/v1`
- **Swagger / OpenAPI 3.0 UI**: `http://localhost:8080/swagger-ui.html`
- **Raw OpenAPI JSON Spec**: `http://localhost:8080/api-docs`

---

## 2. Standard Envelope Format
All responses adhere to the standard `ApiResponse<T>` envelope:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-11-19T12:00:00Z"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "timestamp": "2026-11-19T12:00:00Z"
}
```

---

## 3. Core Modules & Endpoints

### 3.1 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account (optional minor flag) | No |
| `POST` | `/api/v1/auth/login` | Log in with email and password | No |
| `POST` | `/api/v1/auth/refresh` | Rotate and issue fresh access token | Cookie |
| `POST` | `/api/v1/auth/logout` | Invalidate refresh token and clear cookie | Yes |
| `GET` | `/api/v1/users/me` | Fetch active authenticated user profile | Yes |

### 3.2 Accessibility & Comfort (`/api/v1/accessibility`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/accessibility` | Get user's server-synchronized comfort settings | Yes |
| `PUT` | `/api/v1/accessibility` | Update theme, font, line spacing, quiet mode | Yes |

### 3.3 Educational Games (`/api/v1/games`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/games/categories` | List educational game categories | No |
| `GET` | `/api/v1/games` | List active games with favorite status | Optional |
| `GET` | `/api/v1/games/{id}` | Detailed game metadata, rules, instructions | Optional |
| `POST` | `/api/v1/games/{id}/sessions` | Start an unhurried game session | Yes |
| `POST` | `/api/v1/games/sessions/{id}/complete` | Submit game session with verified non-punitive score | Yes |
| `GET` | `/api/v1/games/history` | User's game history and positive milestones | Yes |

### 3.4 Learning Corner (`/api/v1/learning`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/learning/categories` | List story categories | No |
| `GET` | `/api/v1/learning/articles` | List articles with simplified text and reading level | Optional |
| `GET` | `/api/v1/learning/articles/{id}` | Get full article with original + simplified text | Optional |
| `POST` | `/api/v1/learning/articles/{id}/toggle-save` | Bookmark/save article for later | Yes |
| `GET` | `/api/v1/learning/saved` | Get user's saved reading list | Yes |

### 3.5 Daily Journey (`/api/v1/routines` & `/api/v1/tasks`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/routines` | Get routines (auto-seeds starter routines if empty) | Yes |
| `POST` | `/api/v1/routines` | Create routine with step sequence | Yes |
| `PATCH` | `/api/v1/routines/steps/{id}/toggle` | Toggle routine step completion | Yes |
| `POST` | `/api/v1/routines/{id}/reset` | Reset steps for a fresh start without guilt | Yes |
| `DELETE` | `/api/v1/routines/{id}` | Delete routine | Yes |
| `GET` | `/api/v1/tasks` | Get today's checklist tasks | Yes |
| `POST` | `/api/v1/tasks` | Create task with category and priority | Yes |
| `PATCH` | `/api/v1/tasks/{id}/toggle` | Toggle task completion | Yes |
| `DELETE` | `/api/v1/tasks/{id}` | Delete task | Yes |

### 3.6 AI Learning Guide (`/api/v1/ai`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/ai/simplify` | Simplify text into short sentences and vocabulary terms | Yes |
| `POST` | `/api/v1/ai/breakdown-task` | Turn complex tasks into 3-4 bite-sized micro-steps | Yes |
| `POST` | `/api/v1/ai/recommend-games` | Suggest activities based on mood/sensory preference | Yes |
| `POST` | `/api/v1/ai/ask` | Educational supportive Q&A without medical claims | Yes |

### 3.7 Guardian Portal (`/api/v1/guardian`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/guardian/relationships` | List connected dependent accounts | Guardian |
| `POST` | `/api/v1/guardian/relationships` | Send link invitation to dependent by email | Guardian |
| `GET` | `/api/v1/guardian/dependents/{id}/consents` | List minor consent authorizations | Guardian |
| `POST` | `/api/v1/guardian/dependents/{id}/consents` | Update consent authorization | Guardian |
| `GET` | `/api/v1/guardian/dependents/{id}/summary` | View positive milestones (child privacy protected) | Guardian |

### 3.8 Administration (`/api/v1/admin`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/admin/overview` | Platform telemetry, user counts, system health | Admin |
| `GET` | `/api/v1/admin/users` | Directory of users with role badges | Admin |
| `GET` | `/api/v1/admin/audit-logs` | Top 50 platform security audit records | Admin |
