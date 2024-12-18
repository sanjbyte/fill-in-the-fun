"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectInterestingWords = selectInterestingWords;
exports.createBlankedText = createBlankedText;
exports.isAppropriate = isAppropriate;
function selectInterestingWords(text) {
    var words = text.split(' ');
    var interestingIndices = [];
    var selectedWords = [];
    // Look for nouns, adjectives, and other interesting words to blank out
    words.forEach(function (word, index) {
        // Skip small words, URLs, and common words
        if (word.length <= 3 ||
            word.includes('http') ||
            /^(the|and|or|but|in|on|at|to|for|of|with)$/i.test(word)) {
            return;
        }
        // Prioritize capitalized words (likely nouns) and longer words
        if (word[0] === word[0].toUpperCase() || word.length > 6) {
            interestingIndices.push(index);
            selectedWords.push(word);
        }
    });
    // Select up to 3-5 words
    var maxBlanks = Math.min(5, Math.max(3, Math.floor(words.length / 5)));
    if (interestingIndices.length > maxBlanks) {
        var selected = new Set();
        while (selected.size < maxBlanks) {
            var randomIndex = Math.floor(Math.random() * interestingIndices.length);
            selected.add(randomIndex);
        }
        return {
            words: Array.from(selected).map(function (i) { return selectedWords[i]; }),
            indices: Array.from(selected).map(function (i) { return interestingIndices[i]; })
        };
    }
    return { words: selectedWords, indices: interestingIndices };
}
function createBlankedText(text, indices) {
    var words = text.split(' ');
    indices.forEach(function (index) {
        words[index] = '_____';
    });
    return words.join(' ');
}
function isAppropriate(text) {
    // Add basic content filtering if needed
    var blacklist = ['inappropriate', 'offensive', 'terms'];
    return !blacklist.some(function (term) { return text.toLowerCase().includes(term); });
}
