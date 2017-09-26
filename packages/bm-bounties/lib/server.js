import Bounties from './modules.js';

import './server/routes.js';
import './server/cron.js';

// index
Bounties._ensureIndex({"status": 1, "isFuture": 1});
Bounties._ensureIndex({"status": 1, "isFuture": 1, "postedAt": 1});

export * from './modules.js';