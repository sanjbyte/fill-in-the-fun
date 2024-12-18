"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startNewGame = startNewGame;
exports.handleSubmission = handleSubmission;
var state_1 = require("./state");
var prompt_1 = require("./prompt");
function startNewGame(context) {
    return __awaiter(this, void 0, void 0, function () {
        var subredditName, _a, topPosts, posts, topPost, processedPrompt, blankedText, newPost, gameState, error_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 9, , 12]);
                    if (!context.subredditId) return [3 /*break*/, 2];
                    return [4 /*yield*/, context.reddit.getSubredditById(context.subredditId).then(function (sub) { return sub.name; })];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = '';
                    _c.label = 3;
                case 3:
                    subredditName = _a;
                    if (!subredditName) {
                        throw new Error('Unable to determine the subreddit.');
                    }
                    return [4 /*yield*/, context.reddit.getTopPosts({
                            subredditName: subredditName,
                            timeframe: 'week',
                            limit: 1,
                        })];
                case 4:
                    topPosts = _c.sent();
                    return [4 /*yield*/, topPosts.all()];
                case 5:
                    posts = _c.sent();
                    topPost = posts[0];
                    if (!!topPost) return [3 /*break*/, 7];
                    return [4 /*yield*/, context.reddit.submitComment({
                            id: (_b = context.postId) !== null && _b !== void 0 ? _b : '',
                            text: "Couldn't fetch a suitable post. Please try again.",
                        })];
                case 6:
                    _c.sent();
                    return [2 /*return*/];
                case 7:
                    processedPrompt = (0, prompt_1.processPrompt)(topPost);
                    blankedText = (0, prompt_1.createGamePrompt)(processedPrompt);
                    return [4 /*yield*/, context.reddit.submitPost({
                            subredditName: subredditName,
                            title: "🎮 Fill-in-the-Fun Game - Create funny responses!",
                            text: blankedText,
                        })];
                case 8:
                    newPost = _c.sent();
                    gameState = (0, state_1.createGameState)(subredditName, newPost.id, processedPrompt.originalText, blankedText, processedPrompt.blankWords, processedPrompt.blankIndices, processedPrompt.originalAuthor);
                    // Store the game state
                    state_1.gameStore[newPost.id] = gameState;
                    return [3 /*break*/, 12];
                case 9:
                    error_1 = _c.sent();
                    console.error('Error in startNewGame:', error_1);
                    if (!context.postId) return [3 /*break*/, 11];
                    return [4 /*yield*/, context.reddit.submitComment({
                            id: context.postId,
                            text: "Error starting game: ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error'),
                        })];
                case 10:
                    _c.sent();
                    _c.label = 11;
                case 11: return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function handleSubmission(context, gameState, filledWords) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, filledText_1, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 5]);
                    userId = (_a = context.userId) !== null && _a !== void 0 ? _a : 'anonymous';
                    if (filledWords.length !== gameState.blankIndices.length) {
                        throw new Error('Wrong number of words provided.');
                    }
                    filledText_1 = gameState.blankedText;
                    gameState.blankIndices.forEach(function (_, i) {
                        filledText_1 = filledText_1.replace('_____', "**".concat(filledWords[i], "**"));
                    });
                    // Submit the filled-in response as a comment
                    return [4 /*yield*/, context.reddit.submitComment({
                            id: gameState.postId,
                            text: "Here's my fill-in:\n\n\"".concat(filledText_1, "\"\n\nUpvote if you like this version! \uD83D\uDC4D"),
                        })];
                case 1:
                    // Submit the filled-in response as a comment
                    _b.sent();
                    // Store the submission in the game state
                    if (!gameState.submissions[userId]) {
                        gameState.submissions[userId] = [];
                    }
                    gameState.submissions[userId].push({
                        words: filledWords,
                        timestamp: Date.now(),
                        score: 0,
                    });
                    return [3 /*break*/, 5];
                case 2:
                    error_2 = _b.sent();
                    console.error('Error in handleSubmission:', error_2);
                    if (!context.postId) return [3 /*break*/, 4];
                    return [4 /*yield*/, context.reddit.submitComment({
                            id: context.postId,
                            text: "Error submitting answer: ".concat(error_2 instanceof Error ? error_2.message : 'Unknown error'),
                        })];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
