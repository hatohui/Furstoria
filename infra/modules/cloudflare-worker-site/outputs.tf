output "worker_id" {
  description = "Immutable ID of the Worker."
  value       = cloudflare_worker.site.id
}

output "worker_name" {
  description = "Worker name, for wrangler.jsonc."
  value       = cloudflare_worker.site.name
}

output "workers_dev_url" {
  description = "workers.dev address (null if the account has no workers.dev subdomain yet)."
  value       = var.workers_dev_enabled ? cloudflare_worker.site.subdomain.url : null
}

output "custom_domain_urls" {
  description = "HTTPS URLs of the attached custom domains."
  value       = [for hostname in keys(cloudflare_workers_custom_domain.site) : "https://${hostname}"]
}
