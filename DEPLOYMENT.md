# Deployment

This app needs a Node host for the backend, so GitHub Pages alone is not enough.

Recommended path:

1. Create a Render Web Service from this repository.
2. Use the settings in `render.yaml`.
3. Add these environment variables in Render:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SECRET_KEY`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `CORS_ORIGIN`
   - `PUBLIC_SITE_ORIGIN`
4. Let Render build and start the app.
5. Point `chamudithaperera.online` to the Render service using a custom domain.

For Supabase, keep using the same `contact_messages` table and the same SQL setup from `SUPABASE_SETUP.md`.

If you are still using GitHub Pages, remember that it can only host the static frontend. It cannot run the Express backend or the `/admin` API routes.
