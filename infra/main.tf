module "site" {
  source = "./modules/cloudflare-worker-site"

  account_id     = var.account_id
  worker_name    = var.worker_name
  custom_domains = var.custom_domains
  tags           = ["furstoria"]
}
