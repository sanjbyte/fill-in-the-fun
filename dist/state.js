export const gameStore = {};
export function createGameState(subredditName, postId, originalText, blankedText, blankWords, blankIndices, originalAuthor) {
    return {
        originalText,
        blankedText,
        blankWords,
        submissions: {},
        blankIndices,
        isActive: true,
        postId,
        subredditName,
        originalAuthor,
        startTime: Date.now(),
    };
}
