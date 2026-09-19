# Weight Tracker — User Manual

A single-page app for daily weight tracking during a cut or bulk. No account, no server — everything lives in your browser.

## 1. Getting started

1. Open the app. On first run, a **Set up your goal** screen appears.
2. Choose **Weight Loss** or **Weight Gain**, optionally set a start weight (leave blank to auto-fill from your first logged entry), pick a start date, a duration in weeks, and a target rate (% of bodyweight per week — you choose the number, the app doesn't prescribe one).
3. Tap **Start tracking**. (Or **Skip for now** — you can set a goal later in Settings.)

## 2. Daily use

- **Log your weight**: type it into the box at the top and tap **Log**. That's the whole workflow.
- Logging again on the same day **overwrites** that day's entry — there's no duplicate-entry cleanup needed.
- To back-fill a missed day, tap **Log for a different date** and pick the date first.

## 3. Reading the dashboard

- **Chart**: gray dots = each day's raw weight. Bold blue line = your 7-day average (the number that actually matters, not daily noise). Dashed orange line = your trend over the last 21 days.
- **Stats panel**:
  - *7-day average* — your current smoothed weight.
  - *Actual rate (3wk)* — how fast you're actually losing/gaining, from the trend line.
  - *Target rate* — what your goal setup implies, in kg/week.
  - *Days remaining* / *Projected end weight* / *Target end weight* — where you're headed vs. where you set out to go.
- **Insight banner** (appears once you have 14+ days of data in your current goal period): tells you if you're behind pace, on target, or ahead of pace — and flags a single-day spike as likely water weight, not signal.

## 4. History

- Scroll down to see every entry, with the daily change and a **Loss**/**Gain** tag showing which goal period it belongs to.
- Tap **✕** next to any entry to delete it. A toast appears with an **Undo** button for a few seconds — tap it if you deleted the wrong thing. After the toast disappears, the delete is final.

## 5. Benchmarks & weekly lifts (the body recomposition manager)

This is the part that crunches the numbers for you so you don't have to sit down and analyze anything yourself.

- **Weekly Lifts card**: once a week, tap **Log this week** and enter your best set for **Pull-ups**, **Dips**, and **Squats** — reps, added weight (0 if bodyweight-only), and RIR (reps you had left in the tank; 0 = to failure). Re-tapping the same week edits that week's numbers instead of duplicating them.
- **Benchmarks**: set "Benchmark every N weeks" when you set up a goal (default 4). Every N weeks, a **Benchmark** card appears above the chart with one plain-language verdict:
  - **Eat more** / **Eat less** — your weight trend over that block was off your target pace, in either direction.
  - **Reduce training volume** — your weight trend was right on target (so your food is correct), but your lifts dropped meaningfully over that block anyway. That's a recovery problem, not a food problem.
  - **Hold steady** — on target and your lifts are holding. Keep going.
- This works for **any goal length and any benchmark frequency** — a 6-week cut with 4-week benchmarks gets one checkpoint, a 21-week bulk gets five. No setup beyond the one number.
- **One caveat**: your very first benchmark compares your lifts against the ~4 weeks *before* your goal even started. If you weren't logging lifts yet back then, that first benchmark will just tell you it doesn't have enough strength data — it still gives you the food verdict from your weight trend either way. Start logging lifts as soon as you can, ideally before you start a new cut/bulk, so the very first checkpoint has something to compare against.

## 6. Settings (gear icon, top right)

- **Active goal**: edit your current goal's type, start weight, start date, duration, or target rate at any time.
- **Start new goal period**: use this when you switch from cutting to bulking (or vice versa). Your history is kept — old entries keep their old tag, new entries get the new one, and the dashboard always evaluates against whichever goal is currently active.
- **Reminders**: turn on "Remind me if I haven't logged today" and pick a time. You'll need to allow notifications when your browser asks.
  - This is **reliable while the app is open** on your phone (it checks in the background of the tab and when you reopen the app).
  - Delivery while the app is fully closed is **best-effort only** — it can work on Android/Chrome installed apps, but is **not supported on iPhone**. Don't rely on it as your only reminder; opening the app each morning is still the sure way to get pinged.
  - Use **Send test notification** to confirm notifications work on your device right now.
- **Backup**:
  - **Export JSON** — full backup of everything (entries, goals, settings). Use this before switching phones or clearing browser data.
  - **Import JSON** — restores from a JSON backup file. This **replaces** all current data, so it'll ask you to confirm.
  - **Export CSV** — your history as a spreadsheet-friendly file (date, weight, daily change, goal tag), for opening in Excel/Sheets/Numbers.
- **Erase all data**: wipes everything from this browser permanently. Export a backup first if you're not sure.

## 7. Installing it like an app

1. Open the site's URL on your phone in Chrome (Android) or Safari (iPhone).
2. Use the browser's menu → **Add to Home Screen**.
3. It now opens full-screen with its own icon, and keeps working **fully offline** — the chart, your data, and logging all work with no signal, since everything is cached on your device.
4. When you (or whoever maintains the site) ship an update, a blue banner will appear at the top saying a new version is available — tap **Refresh** whenever you're ready. It won't force a refresh on its own.

## 8. Where your data lives (important)

- Everything is stored **only in this browser, on this device** (localStorage). There is no cloud, no account, no sync between devices.
- Clearing your browser's site data, switching browsers, or switching phones **will lose your data** unless you've exported a backup first.
- **Export JSON regularly** — it's the only backup you have. Treat it like you'd treat a photo library: back it up before doing anything drastic to your device or browser.

## 9. Quick troubleshooting

| Problem | Fix |
|---|---|
| Chart/stats say "—" or don't show | You need at least one logged entry. |
| Insight banner isn't showing | It only appears once you have 14+ days of data within your *current* goal period. |
| Notifications don't fire when the app is closed | Expected on iPhone (not supported) and best-effort elsewhere. Rely on opening the app, not the background notification. |
| Lost my data after clearing browser storage | Only recoverable if you'd previously used Export JSON. Import that file in Settings. |
| Update banner never appears | You're already on the latest version, or you're not connected to the internet when the check happens. |
| No Benchmark card showing up | Benchmarks only appear once the scheduled date has passed (e.g. day 28 for a 4-week frequency) and you have weight entries in that window. |
| Benchmark says "not enough data" for lifts | You need at least one logged week of lifts in both the current and previous 4-week block. Keep logging weekly and it'll fill in from the next benchmark on. |
