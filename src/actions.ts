import { Context, SubmitPostOptions } from "@devvit/public-api";
import { GameState, gameStore, createGameState } from "./state";
import { processPrompt } from "./prompt";

export async function startNewGame(context: Context): Promise<void> {
  try {
    const subreddit = await context.reddit.getCurrentSubreddit();

    if (!subreddit) {
      throw new Error("Subreddit context not found");
    }

    const topPosts = await subreddit.getTopPosts({ timeframe: "day", limit: 1 }).all();
    const topPost = topPosts[0];

    if (!topPost || !topPost.body || !topPost.title) {
      throw new Error("Couldn't find a suitable post for the game.");
    }

    // Process the top post to create blanks
    const { blankedText, blankWords, blankIndices } = processPrompt(topPost);

    // Create the game state
    const gameState: GameState = createGameState(
      subreddit.name,
      topPost.id,
      topPost.body,
      blankedText,
      blankWords,
      blankIndices,
      topPost.authorName ?? "Unknown"
    );

    gameStore[topPost.id] = gameState;

    // Prepare the post options
    const postOptions: SubmitPostOptions = {
      title: `🎮 Fill-in-the-Fun is live! 🎉`,
      text: `Complete the blanks in the following sentence:\n\n"${blankedText}"\n\nSubmit your answers in the comments. The most upvoted response wins!`,
      sendreplies: true,
      nsfw: false,
      subredditName: subreddit.name, // Valid property for SubmitPostOptions
    };

    // Submit a post for the game
    await context.reddit.submitPost(postOptions);

    console.log("Game successfully started!");
  } catch (error) {
    console.error("Error starting the game:", error);
    await context.ui.showToast({
      text: `Error starting the game: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    });
  }
}