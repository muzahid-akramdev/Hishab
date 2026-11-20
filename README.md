# Hishab (হিসাব)

A personal daily expense & profit tracker built with Expo (React Native) and Supabase.

## Stack
- Expo (managed workflow), React Navigation
- Supabase: email/password auth + Postgres `entries` table with row-level security

## Setup

```bash
npm install
npx expo install --fix
cp .env.example .env
```

Fill `.env` with `SUPABASE_URL` and `SUPABASE_ANON_KEY` (Supabase dashboard → Settings → API). The `entries` table needs RLS so each user only sees their own rows:

```sql
alter table entries enable row level security;
create policy "Users can manage their own entries" on entries for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## Run locally

```bash
npx expo start
```

Scan the QR code with Expo Go, or launch an Android emulator.

## Build an APK with EAS

```bash
npm install -g eas-cli
eas login
eas build:configure
eas env:create --scope project --name SUPABASE_URL --value "https://your-project-ref.supabase.co" --environment preview
eas env:create --scope project --name SUPABASE_ANON_KEY --value "your-anon-key-here" --environment preview
eas build --platform android --profile preview
```

All `eas.json` profiles use `"buildType": "apk"`. When the build finishes, EAS prints a direct download link to the `.apk` — open it on the phone and allow "install from unknown sources" the first time. Re-run the build command after changes.
