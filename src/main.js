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
var public_api_1 = require("@devvit/public-api");
var blocks_1 = require("./blocks");
var state_1 = require("./state");
// Register custom post type
public_api_1.Devvit.addCustomPostType(blocks_1.gamePostType);
// Add a menu item for starting the game
public_api_1.Devvit.addMenuItem({
    label: 'Start Fill-in-the-Fun Game',
    location: 'post', // Available in the subreddit post menu
    onPress: function (event, context) { return __awaiter(void 0, void 0, void 0, function () {
        var subreddit, user, gameState, error_1;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 6, , 8]);
                    return [4 /*yield*/, context.reddit.getCurrentSubreddit()];
                case 1:
                    subreddit = _f.sent();
                    return [4 /*yield*/, context.reddit.getCurrentUser()];
                case 2:
                    user = _f.sent();
                    if (!(!subreddit || !user)) return [3 /*break*/, 4];
                    return [4 /*yield*/, context.reddit.submitComment({
                            id: (_a = event.targetId) !== null && _a !== void 0 ? _a : '',
                            text: 'Error: Unable to retrieve subreddit or user information.',
                        })];
                case 3:
                    _f.sent();
                    return [2 /*return*/];
                case 4:
                    gameState = {
                        postId: (_b = event.targetId) !== null && _b !== void 0 ? _b : '',
                        subredditName: subreddit.name,
                        startTime: Date.now(),
                        isActive: true,
                        blankWords: ['funny', 'silly', 'quirky'],
                        blankedText: 'The _____ fox jumped over the _____ dog.',
                        originalText: 'The funny fox jumped over the silly dog.',
                        blankIndices: [10, 34],
                        submissions: {},
                        originalAuthor: user.username,
                    };
                    state_1.gameStore[(_c = event.targetId) !== null && _c !== void 0 ? _c : ''] = gameState;
                    return [4 /*yield*/, context.reddit.submitComment({
                            id: (_d = event.targetId) !== null && _d !== void 0 ? _d : '',
                            text: "The game 'Fill in the Fun' has started! Submit your funniest answers!",
                        })];
                case 5:
                    _f.sent();
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _f.sent();
                    console.error('Error starting the game:', error_1);
                    return [4 /*yield*/, context.reddit.submitComment({
                            id: (_e = event.targetId) !== null && _e !== void 0 ? _e : '',
                            text: "Error starting the game: ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error'),
                        })];
                case 7:
                    _f.sent();
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); },
});
exports.default = public_api_1.Devvit;
