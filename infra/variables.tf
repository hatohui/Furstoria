variable "account_id" {
  description = "Cloudflare account ID."
  type        = string
}

variable "worker_name" {
  description = "Worker name. Must match `name` in wrangler.jsonc."
  type        = string
  default     = "furstoria"
}

variable "custom_domains" {
  description = "Optional custom domains, e.g. [{ hostname = \"furstoria.example.com\", zone_id = \"...\" }]."
  type = list(object({
    hostname = string
    zone_id  = string
  }))
  default = []
}
