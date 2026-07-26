# Fixed Versions From Docker Scout

## Scope

- Image audited before remediation: `backend-adoptions-final:1.0.0`
- Affected path for all vulnerable packages: `/usr/local/lib/node_modules/npm/node_modules/...`
- Classification for all affected packages: bundled in global `npm` from the `node:24-alpine` base image
- Not found under `/app/node_modules`
- Not found under `corepack`

## tar@7.5.15

Path:
- `/usr/local/lib/node_modules/npm/node_modules/tar/package.json`

Layer:
- `sha256:0ba8902ff50f7fee1d64f2ed6d666e61a9fde25a6d288e667ac6690dd864f97b`

CVEs and advisories:

| ID | Severity | Installed | Fixed version |
| --- | --- | --- | --- |
| `CVE-2026-59873` | Critical | `7.5.15` | `7.5.19` |
| `CVE-2026-59874` | High | `7.5.15` | `7.5.18` |
| `CVE-2026-53655` | Medium | `7.5.15` | `7.5.16` |
| `GHSA-r292-9mhp-454m` | Medium | `7.5.15` | `7.5.21` |
| `CVE-2026-59875` | Medium | `7.5.15` | `7.5.17` |
| `CVE-2026-59871` | Medium | `7.5.15` | `7.5.18` |

## brace-expansion@5.0.6

Path:
- `/usr/local/lib/node_modules/npm/node_modules/brace-expansion/package.json`

Layer:
- `sha256:0ba8902ff50f7fee1d64f2ed6d666e61a9fde25a6d288e667ac6690dd864f97b`

CVEs:

| ID | Severity | Installed | Fixed version |
| --- | --- | --- | --- |
| `CVE-2026-13149` | High | `5.0.6` | `5.0.7` |
| `CVE-2026-14257` | High | `5.0.6` | `5.0.8` |

## undici@6.26.0

Path:
- `/usr/local/lib/node_modules/npm/node_modules/undici/package.json`

Layer:
- `sha256:0ba8902ff50f7fee1d64f2ed6d666e61a9fde25a6d288e667ac6690dd864f97b`

CVEs:

| ID | Severity | Installed | Fixed version |
| --- | --- | --- | --- |
| `CVE-2026-12151` | High | `6.26.0` | `6.27.0` |
| `CVE-2026-9679` | Medium | `6.26.0` | `6.27.0` |
| `CVE-2026-6733` | Low | `6.26.0` | `6.27.0` |
| `CVE-2026-11525` | Low | `6.26.0` | `6.27.0` |

## Remediation chosen

- The vulnerable packages did not belong to the application runtime dependency tree.
- The runtime image starts with `node src/server.js` and does not require `npm` or `npx`.
- Remediation applied: remove global `npm` and `npx` only from the `runtime` stage.
- No application dependency was deleted.
- No Node major version was changed.
- No automatic `npm audit fix` was used.
