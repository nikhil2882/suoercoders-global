module.exports = {
  apps: [
    {
      script: "todoServer.js",
      watch: true,
      ignore_watch: ["node_modules", "uploads"],
    },
  ],
};
