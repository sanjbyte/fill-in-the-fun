"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInterestingWord = isInterestingWord;
exports.selectPromptFromPosts = selectPromptFromPosts;
exports.processPrompt = processPrompt;
exports.createGamePrompt = createGamePrompt;
exports.validateSubmission = validateSubmission;
// Words that shouldn't be removed (articles, prepositions, etc.)
var KEEP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'nor', 'for', 'yet', 'so',
    'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'from',
    'is', 'are', 'was', 'were', 'has', 'have', 'had'
]);
// Words that are good candidates for blanks
var INTERESTING_WORD_PATTERNS = [
    /^[A-Z][a-z]+/, // Capitalized words (proper nouns)
    /\d+/, // Numbers
    /^(awesome|amazing|incredible|terrible|horrible|beautiful|ugly|smart|stupid|funny|weird|strange|crazy|wild|huge|tiny)/i, // Descriptive adjectives
    /[!?]+$/, // Words with emphasis
];
function isInterestingWord(word) {
    // Skip short words and common words
    if (word.length < 4 || KEEP_WORDS.has(word.toLowerCase())) {
        return false;
    }
    // Check if word matches any interesting patterns
    return INTERESTING_WORD_PATTERNS.some(function (pattern) { return pattern.test(word); });
}
function selectPromptFromPosts(posts) {
    // Filter out unsuitable posts
    var eligiblePosts = posts.filter(function (post) {
        if (!post.title)
            return false;
        var words = post.title.split(/\s+/);
        // Post should have enough words and interesting content
        return (words.length >= 8 && // Minimum length
            words.length <= 30 && // Maximum length
            words.some(isInterestingWord) && // Has interesting words
            !post.title.includes('http') && // No URLs
            !/^\[.*\]/.test(post.title) && // No tagged posts
            !/^[\d.]+/.test(post.title) // Don't start with numbers
        );
    });
    if (eligiblePosts.length === 0)
        return null;
    // Select a random post from eligible ones
    return eligiblePosts[Math.floor(Math.random() * eligiblePosts.length)];
}
function processPrompt(post) {
    var _a;
    if (!post.title) {
        throw new Error('Post must have a title');
    }
    var words = post.title.split(/\s+/);
    var blankIndices = [];
    var blankWords = [];
    // First pass: identify all potential words to blank out
    var potentialBlanks = words.map(function (word, index) { return ({
        word: word,
        index: index,
        interesting: isInterestingWord(word)
    }); }).filter(function (item) { return item.interesting; });
    // Determine how many blanks to create based on sentence length
    var numBlanks = Math.min(Math.max(3, Math.floor(words.length / 6)), // At least 3, or 1 per 6 words
    Math.min(5, potentialBlanks.length) // Maximum 5 blanks or all potential blanks
    );
    // Randomly select words to blank out
    while (blankIndices.length < numBlanks && potentialBlanks.length > 0) {
        var randomIndex = Math.floor(Math.random() * potentialBlanks.length);
        var selected = potentialBlanks.splice(randomIndex, 1)[0];
        blankIndices.push(selected.index);
        blankWords.push(selected.word);
    }
    // Sort indices to process them in order
    blankIndices.sort(function (a, b) { return a - b; });
    // Create blanked text
    var blankedWords = __spreadArray([], words, true);
    blankIndices.forEach(function (index, i) {
        blankedWords[index] = '_____';
    });
    return {
        originalText: post.title,
        blankedText: blankedWords.join(' '),
        blankIndices: blankIndices,
        blankWords: blankWords,
        originalAuthor: (_a = post.authorName) !== null && _a !== void 0 ? _a : '[deleted]'
    };
}
function createGamePrompt(processedPrompt) {
    return [
        "\uD83C\uDFAE Fill in the Fun Challenge!\n",
        "Make this post funnier by filling in the blanks:\n\n",
        "\"".concat(processedPrompt.blankedText, "\"\n\n"),
        "\u2022 ".concat(processedPrompt.blankIndices.length, " blanks to fill"),
        "\u2022 Be creative and funny!",
        "\u2022 Upvote your favorite submissions",
        "\u2022 Original post by u/".concat(processedPrompt.originalAuthor, "\n\n"),
        "Use the \"Submit Answer\" button below to participate!"
    ].join('\n');
}
function validateSubmission(answers) {
    for (var _i = 0, answers_1 = answers; _i < answers_1.length; _i++) {
        var answer = answers_1[_i];
        // Check for minimum and maximum length
        if (answer.length < 1 || answer.length > 30) {
            return {
                isValid: false,
                error: "Each answer must be between 1 and 30 characters long."
            };
        }
        // Check for valid characters
        if (!/^[a-zA-Z0-9\s!?,.'-]*$/.test(answer)) {
            return {
                isValid: false,
                error: "Answers can only contain letters, numbers, and basic punctuation."
            };
        }
        // Check for appropriate content (basic filter)
        if (/^(http|www\.)/i.test(answer)) {
            return {
                isValid: false,
                error: "URLs are not allowed in answers."
            };
        }
    }
    return { isValid: true };
}
