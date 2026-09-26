# Infra — Cloudflare Workers

The site runs on a Cloudflare Worker via [OpenNext](https://opennext.js.org/cloudflare).
Responsibilities are split:

| Owner | Manages |
| --- | --- |
| Terraform (`infra/`) | The Worker itself: name, `workers.dev` subdomain, preview URLs, observability, custom domains |
| Wrangler (`bun run deploy`) | Code: builds with OpenNext and uploads a new Worker version (assets, `IMAGES` binding, etc. from `wrangler.jsonc`) |

`next/image` optimization is served by the Cloudflare Images binding (`IMAGES`).
It is billed per unique transformation, with a free monthly allowance.

## Credentials

Create an API token (Dashboard → My Profile → API Tokens) with:

- Account → **Workers Scripts: Edit** (covers the Worker and custom domains)
- Account → **Workers Tail: Read**

If attaching a custom domain fails with an authorization error, also grant
Zone → **DNS: Edit** on that zone.

Both tools read it from the environment:

```bash
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...   # wrangler
```

## First deploy

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars   # set account_id
terraform init
terraform apply                                # creates the Worker
cd ..
bun run deploy                                 # builds + uploads the code
```

Terraform prints `workers_dev_url`. It is `null` if the account has never
claimed a `workers.dev` subdomain — open Workers & Pages in the dashboard once
to claim it, then `terraform apply` again.

## Later deploys

Code changes only need `bun run deploy`. Run `terraform apply` when changing
anything in `infra/`.

## Adding a custom domain

The zone must be on the same Cloudflare account and the Worker must have been
deployed at least once. Add it to `terraform.tfvars` and apply; Cloudflare
creates the DNS record and certificate:

```hcl
custom_domains = [
  { hostname = "furstoria.example.com", zone_id = "<zone-id>" },
]
```

## Keep in sync

- `worker_name` (Terraform) ↔ `name` and the `WORKER_SELF_REFERENCE` service in `wrangler.jsonc`
- `workers_dev_enabled` / `preview_urls_enabled` ↔ `workers_dev` / `preview_urls` in `wrangler.jsonc`
  — a mismatch makes each deploy flip the setting back and forth.

State is local (`infra/terraform.tfstate`, gitignored). Move it to a remote
backend before more than one person or CI applies.
