// Hands the site in: copies app/ and screenshots/ from beside this file
// to /output and writes /output/dossier.json with the kit's own dossier
// builder, so the judge reads exactly what the gate reads. Node 22,
// standard library only; MAKEFUN_OUTPUT_DIR stands in for /output locally.
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The scorer's own caps: at most 4 screenshots of 256 KiB each, app/ at
// most 993 files and 16 MiB. buildDossier refuses anything past them, so a
// hand-in that writes a dossier has already passed the size gate.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
