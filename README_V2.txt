ROOM ENGINE V2 — CLOUDFLARE MMO INTEGRATED

Basis V2:
- mempertahankan API register/login/me/logout dari project Cloudflare MMO V4
- mempertahankan D1 binding DB
- mempertahankan Durable Object GAME_ROOM / WebSocket multiplayer
- mempertahankan pilihan sprite murid01..murid20 dan npc01..npc30
- menambahkan room engine modular, portal, collision client, NPC behavior, quest, quiz, popup, chat bubble 3 detik, reconnect

FILE UTAMA YANG DIGANTI:
- public/index.html
- public/game/rooms.js
- src/index.ts

MIGRATION:
Tidak ada tabel baru yang diwajibkan V2. Migration sprite 0002 tetap disertakan untuk referensi.
Jika 0002_add_sprite.sql sudah pernah dijalankan pada D1, JANGAN jalankan ulang.

PENTING:
Pertahankan wrangler.jsonc project Cloudflare Anda yang sekarang, termasuk:
- name Worker yang aktif
- database_id D1 cloudflare-mmo-db
- binding DB
- binding GAME_ROOM
- migration Durable Object yang sudah aktif

Jangan mengganti wrangler.jsonc dengan konfigurasi lama yang memiliki database_id placeholder.

SPRITE:
- public/sprites/murid01.png ... murid20.png
- public/sprites/npc01.png ... npc30.png
Semua dapat diganti manual dengan file berukuran/dimensi sprite sheet yang sama.

ROOM BLUEPRINT:
Edit public/game/rooms.js untuk menambah/mengubah room, object, NPC, portal, quest, quiz.
Engine membaca data blueprint sehingga room tidak ditanam langsung di renderer.

ROOM V2:
halaman, selasar, kelas1, kelas2, perpustakaan, lapangan.

DEPLOY:
1. Upload/replace public/index.html, public/game/rooms.js, src/index.ts dan sprites.
2. Commit + push ke GitHub.
3. Workers Builds deploy otomatis.
4. Jangan jalankan migration 0002 lagi bila sudah pernah dijalankan.
