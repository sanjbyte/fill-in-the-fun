import { Devvit } from "@devvit/public-api";
import { gameStore } from "./state";
const BLANK_FIELD_FORM = Devvit.createForm({
    fields: [
        {
            type: "string",
            name: "blank_1",
            label: "First blank",
            placeholder: "Enter your first word",
            required: true,
        },
        {
            type: "string",
            name: "blank_2",
            label: "Second blank",
            placeholder: "Enter your second word",
            required: true,
        },
    ],
}, async (event, context) => {
    const postId = context.postId;
    if (!postId) {
        console.error("Post ID is missing from context.");
        return;
    }
    const { blank_1, blank_2 } = event.values;
    const gameState = gameStore[postId];
    if (!gameState || !gameState.isActive) {
        await context.reddit.submitComment({
            id: postId,
            text: "No active game found for this post! Please start a new game.",
        });
        return;
    }
    const userId = context.userId ?? "anonymous";
    gameState.submissions[userId] = [
        ...(gameState.submissions[userId] || []),
        {
            words: [blank_1, blank_2],
            timestamp: Date.now(),
            score: 0,
        },
    ];
    const filledText = gameState.blankedText
        .replace(/_____/g, blank_1) // Use regex with 'g' flag for global replace
        .replace(/_____/g, blank_2);
    try {
        await context.reddit.submitComment({
            id: postId,
            text: `Here's my submission:\n\n"${filledText}"\n\nUpvote if you like this response!`,
        });
    }
    catch (error) {
        console.error("Error submitting comment", error);
        await context.reddit.submitComment({
            id: postId,
            text: `Error submitting your response: ${error.message}`,
        });
    }
});
const gamePostType = {
    name: "fill-in-the-fun",
    render: async (context) => {
        const game = gameStore[context.postId ?? ""];
        if (!game || !game.isActive) {
            return (Devvit.createElement("vstack", null,
                Devvit.createElement("text", null, "No active game found. Please start a new game.")));
        }
        return (Devvit.createElement("vstack", { gap: "medium" },
            Devvit.createElement("text", null, game.blankedText),
            Devvit.createElement("button", { onPress: async () => {
                    if (!context.postId) {
                        console.error("Post ID is missing.");
                        return;
                    }
                    await context.ui.showForm(BLANK_FIELD_FORM, { targetId: context.postId });
                } }, "Submit Your Answer")));
    },
};
export { BLANK_FIELD_FORM, gamePostType };
