# Hishab (হিসাব)

A personal daily expense & profit tracker built with Expo (React Native) and Supabase.

## Stack
- Expo (managed workflow), React Navigation
- Supabase: email/password auth + Postgres `entries` table with row-level security
- Warm paper-ledger UI: cream background, deep teal ink, muted gold accent, sage (income) / wine (expense)

## 1. Install dependencies

```bash
cd hishab
npm install
npx expo install --fix   # aligns native module versions with your installed Expo SDK
```

## 2. Configure Supabase

Copy the example env file and fill in your project's values (Supabase dashboard → Settings → API):

```bash
cp .env.example .env
```

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

The `entries` table is assumed to already exist with RLS enabled so each user only sees their
own rows. For reference, the policies should look roughly like:

```sql
alter table entries enable row level security;

create policy "Users can manage their own entries"
on entries for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

## 3. Run locally

```bash
npx expo start
```

Scan the QR code with Expo Go on an Android device, or press `a` to launch an Android emulator.

## 4. Building a downloadable APK with EAS

The `eas.json` in this project has three profiles (`development`, `preview`, `production`), all
configured with `"buildType": "apk"` so you get a directly-installable `.apk` instead of an `.aab`
(Play Store bundle).

### One-time setup

```bash
npm install -g eas-cli
eas login
eas build:configure
```

This links the project to an EAS project ID (it will patch `app.config.js`'s
`extra.eas.projectId` automatically, or you can set the `EAS_PROJECT_ID` env var yourself).

### Set your Supabase secrets for cloud builds

EAS Build runs on Expo's servers, so your local `.env` file isn't uploaded. Register the
same two variables as EAS environment variables, scoped to the `preview` (and `production`)
profiles:

```bash
eas env:create --scope project --name SUPABASE_URL --value "https://your-project-ref.supabase.co" --environment preview
eas env:create --scope project --name SUPABASE_ANON_KEY --value "your-anon-key-here" --environment preview
```

Repeat with `--environment production` when you're ready to cut a production APK.

### Run the build

```bash
eas build --platform android --profile preview
```

- You'll be prompted to log in (if not already) and EAS will generate/manage an Android keystore
  for you automatically — accept the default.
- The CLI uploads your project, builds it in the cloud, and prints a build details URL you can
  open to watch progress.
- When it finishes, the terminal (and the EAS dashboard at expo.dev) shows a **direct download
  link** to the `.apk` file.

### Installing the APK on a phone

1. Open the printed `https://expo.dev/artifacts/...` link on the Android device, or download the
   `.apk` and transfer it via USB/Drive.
2. Tap the file to install. Android will warn about "installing from unknown sources" the first
   time — allow it for your file manager/browser.
3. Open **Hishab**, sign up with an email/password, and start logging entries.

### Rebuilding after changes

Just re-run `eas build --platform android --profile preview` — each run produces a fresh
`.apk` with its own download link.
