module.exports = {
  //appId: "your-app-id", // Uncomment and replace with your actual App ID when ready to upload
  title: "Fill in the Fun",
  description: "A fun word game for your subreddit",
  version: "1.0.0",
  
  environments: ["development", "production"],
  permissions: {
    ui: true,
    moderation: true, // This grants the app full moderator permissions
    posts: true,
  },
  api: {
    redditAPI: true,
  },
  actors: {
    main: {
      entry: "src/main.tsx",
    },
  },
};