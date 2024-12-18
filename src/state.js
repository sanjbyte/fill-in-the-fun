"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameStore = void 0;
exports.createGameState = createGameState;
exports.addSubmission = addSubmission;
exports.getSubmissionScore = getSubmissionScore;
exports.updateSubmissionScore = updateSubmissionScore;
exports.getLeaderboard = getLeaderboard;
exports.gameStore = {};
// Function to create a new game state
function createGameState(subredditName, postId, originalText, blankedText, blankWords, blankIndices, originalAuthor) {
    return {
        // Basic game info
        postId: postId,
        subredditName: subredditName,
        isActive: true,
        startTime: Date.now(),
        // Original post info
        originalText: originalText,
        originalAuthor: originalAuthor,
        // Game content
        blankedText: blankedText,
        blankWords: blankWords,
        blankIndices: blankIndices,
        // Player interactions
        submissions: {},
    };
}
// Helper function to add a submission
function addSubmission(gameState, userId, words) {
    if (!gameState.submissions[userId]) {
        gameState.submissions[userId] = [];
    }
    gameState.submissions[userId].push({
        words: words,
        timestamp: Date.now(),
        score: 0,
    });
}
// Helper function to get the score of a specific submission
function getSubmissionScore(gameState, userId, submissionIndex) {
    var _a, _b, _c;
    return (_c = (_b = (_a = gameState.submissions[userId]) === null || _a === void 0 ? void 0 : _a[submissionIndex]) === null || _b === void 0 ? void 0 : _b.score) !== null && _c !== void 0 ? _c : 0;
}
// Helper function to update the score of a specific submission
function updateSubmissionScore(gameState, userId, submissionIndex, newScore) {
    var _a;
    if ((_a = gameState.submissions[userId]) === null || _a === void 0 ? void 0 : _a[submissionIndex]) {
        gameState.submissions[userId][submissionIndex].score = newScore;
    }
}
// Helper function to get the leaderboard for a game
function getLeaderboard(gameState) {
    var allSubmissions = Object.entries(gameState.submissions)
        .flatMap(function (_a) {
        var userId = _a[0], submissions = _a[1];
        return submissions.map(function (submission) { return ({
            userId: userId,
            score: submission.score,
            submission: submission.words,
        }); });
    })
        .sort(function (a, b) { return b.score - a.score; });
    return allSubmissions;
}
