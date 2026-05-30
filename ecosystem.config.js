module.exports = {
  apps: [
    {
      name: "cbm-dev",
      script: "node_modules/next/dist/bin/next",
      args: "dev",
      cwd: "c:\\Dev\\Coded by M\\cbm-port",
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
