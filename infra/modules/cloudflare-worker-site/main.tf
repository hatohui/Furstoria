# The Worker entity only: name, routing and observability settings. Code is
# uploaded separately as Worker versions by wrangler (`opennextjs-cloudflare
# deploy`), so Terraform never needs the build output.
resource "cloudflare_worker" "site" {
  account_id = var.account_id
  name       = var.worker_name
  tags       = var.tags

  subdomain = {
    enabled          = var.workers_dev_enabled
    previews_enabled = var.preview_urls_enabled
  }

  observability = {
    enabled            = var.observability.enabled
    head_sampling_rate = var.observability.head_sampling_rate
  }
}

resource "cloudflare_workers_custom_domain" "site" {
  for_each = { for d in var.custom_domains : d.hostname => d }

  account_id = var.account_id
  zone_id    = each.value.zone_id
  hostname   = each.value.hostname
  service    = cloudflare_worker.site.name
}
