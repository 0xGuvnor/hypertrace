import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "deposit source clustering",
  { minutes: 3 },
  internal.clusters.rebuildDepositSource,
  {},
);

export default crons;
