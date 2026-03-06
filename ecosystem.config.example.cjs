module.exports = {
  apps: [
    {
      name: "overtime-security",
      script: "npm",
      args: "run serve",
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: "production",
        CLOUDFLARE_ZONE_ID: process.env.CLOUDFLARE_ZONE_ID || "your-zone-id",
        CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN || "your-api-token"
      }
    },
    {
      name: "webhook",
      script: "/opt/homebrew/bin/webhook",
      args: "-hooks /path/to/over-time-security/hooks.json -port 9000",
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "cloudflared",
      script: "/opt/homebrew/bin/cloudflared",
      args: "tunnel --config /path/to/.cloudflared/config.yml run your-tunnel-id",
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
