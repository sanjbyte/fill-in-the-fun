import { Devvit } from "@devvit/public-api";
import { gameStore, createGameState } from "./state";
// Create the dynamic form
export const MODERATOR_BLANK_SELECTION_FORM = Devvit.createForm((data) => {
    console.log("Dynamic form setup data:", data);
    return {
        title: "Select Words to Blank",
        description: `Choose words to blank from the post: "${data.postTitle}"`,
        fields: [
            {
                type: "string",
                name: "selectedBlanks",
                label: "Words to Blank (comma-separated)",
                placeholder: "e.g., Banana, Undo",
                required: true,
            },
        ],
    };
}, async (event, context) => {
    console.log("Form submission received:", { values: event.values, formData: event.data });
    if (!event.data) {
        console.error("Form data is missing in the submission event.");
        context.ui.showToast({ text: "Error: Form data is missing." });
        return;
    }
    const { postId, postTitle } = event.data;
    if (!postId || !postTitle) {
        console.error("Post ID or Title is missing in form submission:", event.data);
        context.ui.showToast({ text: "Error: Invalid post data. Please try again." });
        return;
    }
    const blankWords = event.values.selectedBlanks.split(",").map((word) => word.trim());
    const postWords = postTitle.split(/\s+/); // Split the title into words
    // Validate if all blankWords exist in the post title
    const invalidWords = blankWords.filter((word) => !postWords.some((w) => w.toLowerCase() === word.toLowerCase()));
    if (invalidWords.length > 0) {
        console.error("Invalid words provided:", invalidWords);
        context.ui.showToast({
            text: `Error: The following words are not in the post: ${invalidWords.join(", ")}`,
        });
        return;
    }
    try {
        const subreddit = await context.reddit.getCurrentSubreddit();
        if (!subreddit) {
            console.error("Unable to retrieve subreddit information.");
            return;
        }
        const blankedText = blankWords.reduce((text, word) => text.replace(new RegExp(`\\b${word}\\b`, "gi"), "_____"), postTitle);
        // Update game store
        gameStore[postId] = createGameState(subreddit.name, postId, postTitle, blankedText, blankWords, [], "unknown_author");
        const newPost = await context.reddit.submitPost({
            subredditName: subreddit.name,
            title: `🎮 Fill-in-the-Fun Game: "${postTitle}"`,
            text: `Complete the blanks in the following sentence:\n\n"${blankedText}"\n\nMost upvoted response wins!`,
            sendreplies: true,
            nsfw: false,
        });
        console.log("Game post created successfully:", newPost);
    }
    catch (error) {
        console.error("An error occurred while processing the form submission:", error);
    }
});
