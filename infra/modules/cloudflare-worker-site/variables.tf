variable "account_id" {
  description = "Cloudflare account ID that owns the Worker."
  type        = string
}

variable "worker_name" {
  description = "Worker name. Must match `name` in the app's wrangler.jsonc, since wrangler uploads code to this Worker."
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]{0,62}$", var.worker_name))
    error_message = "worker_name must be lowercase alphanumerics and dashes, max 63 chars."
  }
}

variable "workers_dev_enabled" {
  description = "Serve the Worker on <worker_name>.<account-subdomain>.workers.dev. Keep in sync with `workers_dev` in wrangler.jsonc."
  type        = bool
  default     = true
}

variable "preview_urls_enabled" {
  description = "Enable per-version preview URLs on workers.dev. Keep in sync with `preview_urls` in wrangler.jsonc."
  type        = bool
  default     = false
}

variable "observability" {
  description = "Workers Logs settings. `head_sampling_rate` is 0-1."
  type = object({
    enabled            = bool
    head_sampling_rate = number
  })
  default = {
    enabled            = true
    head_sampling_rate = 1
  }

  validation {
    condition     = var.observability.head_sampling_rate >= 0 && var.observability.head_sampling_rate <= 1
    error_message = "observability.head_sampling_rate must be between 0 and 1."
  }
}

variable "custom_domains" {
  description = <<-EOT
    Custom domains to route to the Worker. Each hostname must be the zone apex
    or a subdomain of the given zone, and the zone must be on this account.
    Cloudflare creates the DNS record and certificate automatically.
    Leave empty to serve only on workers.dev.
  EOT
  type = list(object({
    hostname = string
    zone_id  = string
  }))
  default = []

  validation {
    condition     = length(var.custom_domains) == length(distinct([for d in var.custom_domains : d.hostname]))
    error_message = "custom_domains hostnames must be unique."
  }
}

variable "tags" {
  description = "Tags attached to the Worker."
  type        = set(string)
  default     = []
}
