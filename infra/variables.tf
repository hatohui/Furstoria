// === ** Cloudflare Variables **/ ===
variable "cloudflare_account_id" {
  description = "The Cloudflare account ID that owns the Worker"
  type        = string
}

variable "cloudflare_api_token" {
  description = "A Cloudflare API token (Workers Scripts:Edit) used by the provider and by wrangler to deploy"
  type        = string
  sensitive   = true
}

// === ** Site Variables **/ ===
variable "worker_name" {
  description = "The Worker name; must match `name` in wrangler.jsonc"
  type        = string
  default     = "furstoria"
}

variable "custom_domains" {
  description = "Optional custom domains, e.g. [{ hostname = \"furstoria.example.com\", zone_id = \"...\" }]"
  type = list(object({
    hostname = string
    zone_id  = string
  }))
  default = []
}
