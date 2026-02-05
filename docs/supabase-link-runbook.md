# Supabase Link Runbook (Task 2.2)

## Status Summary

| Step | Status | Notes |
|------|--------|--------|
| Access token | **You must do** | Generate at https://supabase.com/dashboard/account/tokens |
| Link command | **Ready to run** | Use commands below after token + DB password |
| Verify (`supabase db remote list`) | **After link** | Run to confirm connection |
| `.env.local` | **Done** | `SUPABASE_DB_PASSWORD` added (replace placeholder) |

---

## Step 1: Get Supabase access token

1. Go to: https://supabase.com/dashboard/account/tokens
2. Click **Generate new token**
3. Name it: **SCP Reader CLI**
4. Copy the token (starts with `sbp_...`)

---

## Step 2: Link the project

**Option A – One-shot (recommended)**  
Set the token and run link with the DB password in one go:

```bash
cd /Users/edwardstone/Development/SCP

# Replace YOUR_ACCESS_TOKEN and YOUR_DB_PASSWORD with real values
export SUPABASE_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
supabase link --project-ref uheeqhngnsncrjqgcvar --password YOUR_DB_PASSWORD --yes
```

**Option B – Interactive**  
If you prefer to paste when prompted:

```bash
cd /Users/edwardstone/Development/SCP
supabase login   # paste token when prompted, then:
supabase link --project-ref uheeqhngnsncrjqgcvar   # paste DB password when prompted
```

---

## Step 3: Verify the link

```bash
supabase db remote list
```

You should see your remote database connection.

---

## Step 4: Update `.env.local` (already done)

`.env.local` already has a placeholder for the DB password. Replace `your-database-password` with your real database password:

```env
SUPABASE_DB_PASSWORD=your-actual-database-password
```

**Database password reminder:**  
If you don’t have it: https://supabase.com/dashboard/project/uheeqhngnsncrjqgcvar/settings/database → **Reset Database Password**.

---

## If you see errors

- **"Access token not provided"** → Run `supabase login` or set `SUPABASE_ACCESS_TOKEN`.
- **"invalid password"** → Use the **database** password from Project Settings → Database, not the anon key.
- **"project not found"** → Confirm project ref: `uheeqhngnsncrjqgcvar`.
