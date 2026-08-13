# Deploying CivicApp to Render

This document explains how to deploy the CivicApp repository to Render using the included `render.yaml` or the Render dashboard.

Required environment variables (set these in Render for the backend web service):
- `MONGODB_URI` — MongoDB connection string (use a managed MongoDB or Atlas).
- `JWT_SECRET` — secret used to sign admin JWTs.
- `ADMIN_EMAIL` — admin login email (required for admin login).
- `ADMIN_PASSWORD` — admin login password (required for admin login).
- `S3_BUCKET` — S3 bucket name to store uploaded photos.
- `AWS_REGION` — AWS region for the S3 bucket (e.g. `us-east-1`).
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` — credentials with PutObject permissions for the bucket.

Notes and recommendations:
- The app now uploads images to S3 when `S3_BUCKET` and `AWS_REGION` are set. Local dev without those variables will cause uploads to return an error.
- Admin credentials are now read from `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables. Make sure to set them in Render.
- You may want to set `PORT` in the Render web service; Render normally sets a port automatically.

Deploy steps (quick):
1. Push this repository to GitHub and ensure `render.yaml` is in the repo root on `main` branch.
2. On Render, connect your GitHub repo and select "Deploy using render.yaml" (or create a single web service manually):
   - Single Web Service (recommended): Build Command: `npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend`, Start Command: `npm start --prefix backend`. Set env vars above.
   - Alternatively, create two services (web + static) as described earlier.
3. Add environment variables in Render for the backend service (`MONGODB_URI`, `JWT_SECRET`).
4. If you need file uploads to persist, migrate uploads to S3 before going live.

Optional: If you prefer a single web service serving both frontend and backend, build the frontend during the backend build and serve `frontend/dist` via Express static middleware. I can add that setup if you want.
