# MediTrack+ Backend (Express + SQLite)

This lightweight backend scaffold provides endpoints for Authentication, Medicines, Stock, Notifications and minimal scheduler logic.

Environment & Setup

1. Copy `.env.example` to `.env` and fill in the SMTP credentials and `JWT_SECRET`.
2. Run:

```bash
cd backend
npm i
npm run dev
```

Endpoints

- `POST /api/auth/signup` — body: {name,email,password,reminder_method} → creates user
- `POST /api/auth/login` — body: {email,password} → returns token + profile
- `POST /api/auth/forgot-password` — body: {email} → sends reset link via email
- `POST /api/auth/reset-password` — body: {token,newPassword} → reset password
- `GET /api/medicines` — protected, list medicines
- `POST /api/medicines` — protected, add medicine
- `PUT /api/medicines/:id` — protected, update medicine
- `GET /api/notifications` — protected, list notifications
- `PUT /api/notifications/:id/done` — protected, mark done

Scheduler

The scheduler runs a cron job every minute to check for low stock and create notifications. This is a simplified stub — production should use queue-based worker (Bull/Redis) or scheduled cloud functions (Firebase Cloud Functions / Cron). The same scheduler can be extended to auto-generate reminders when medicine reminder times match the current time.

Notes

- Passwords are hashed with bcrypt.
- Tokens are JWT; include Authorization: Bearer <token> for protected endpoints.
- Database file is `backend/meditrack.db` (SQLite) and created automatically.
