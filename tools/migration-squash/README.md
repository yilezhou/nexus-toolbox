# Migration-Squash 🧹🏛️

**The Problem:** AI-driven builders (like Lovable, Bolt, v0) often generate hundreds of tiny, incremental SQL migration files. When remixing or migrating projects, these "history logs" overwhelm the AI, leading to "Recursive Debt" and broken backends.

**The Solution:** Nexus-Squash consolidates an entire directory of messy SQL migrations into a single, clean `init.sql` file representing the **final state** of the database.

---

## 👥 Client Guide: How to use this

If you are a founder or developer struggling with a "broken remixed backend," follow these steps:

### Option A: The AI Prompt (No setup required)
1. Open the [Prompt Template](./prompt-template.md).
2. Copy the text.
3. Paste it into your AI (Claude, ChatGPT, or Lovable's editor) along with the contents of your `supabase/migrations` folder.
4. The AI will provide you with one clean `init.sql`.

### Option B: The Python Script
1. Download `squash.py`.
2. Place your `.sql` migration files into a folder named `/migrations`.
3. Run: `python3 squash.py`
4. Use the generated `nexus-init.sql` to initialize your new project's database.

---

## 🛠️ Technical Details
- **Deterministic Merging:** Calculates the net result of `CREATE`, `ALTER`, `RENAME`, and `DROP` commands.
- **AI-Ready:** Optimized for injection into AI builder backends (Supabase/Postgres).

*Part of the **Sentinel Nexus** Toolbox by Michael.*
