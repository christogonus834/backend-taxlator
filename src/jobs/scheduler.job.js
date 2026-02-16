// =========================
// src/jobs/scheduler.job.js
// =========================

// =========================
import cron from "node-cron";
import { cleanupOldHistory } from "./historyCleanup.job.js";
// =========================

// ========================= OLD HISTORY CLEAN UP SCHEDULE =========================
// runs 2AM daily
cron.schedule("0 2 * * *", cleanupOldHistory);
