# Cloudflare MMO v1
Prototype: register/login, PBKDF2 password hashing, HttpOnly session cookie, D1 account/character/session database, Durable Object WebSocket map, Workers Static Assets, 1 village map, realtime movement.

## Setup
1. Upload all files to a new GitHub repository.
2. Cloudflare Dashboard -> Workers & Pages -> Create -> Worker -> connect GitHub.
3. Create a D1 database named `cloudflare-mmo-db`.
4. Copy its Database ID into `wrangler.jsonc` replacing `REPLACE_WITH_YOUR_D1_DATABASE_ID`.
5. Deploy the Worker.
6. Apply `migrations/0001_initial.sql` to the remote D1 database using Wrangler: `npx wrangler d1 execute cloudflare-mmo-db --remote --file=./migrations/0001_initial.sql` (or paste SQL in the D1 SQL console).
7. Open the Worker URL.

This is a prototype, not production-ready. Next improvements: rate limits, server-authoritative movement, zone/interest management, NPCs, quests, inventory, combat, autosave and compact packets.
