export function selectInterestingWords(text) {
    const words = text.split(' ');
    const interestingIndices = [];
    const selectedWords = [];
    // Look for nouns, adjectives, and other interesting words to blank out
    words.forEach((word, index) => {
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
    const maxBlanks = Math.min(5, Math.max(3, Math.floor(words.length / 5)));
    if (interestingIndices.length > maxBlanks) {
        const selected = new Set();
        while (selected.size < maxBlanks) {
            const randomIndex = Math.floor(Math.random() * interestingIndices.length);
            selected.add(randomIndex);
        }
        return {
            words: Array.from(selected).map(i => selectedWords[i]),
            indices: Array.from(selected).map(i => interestingIndices[i])
        };
    }
    return { words: selectedWords, indices: interestingIndices };
}
export function createBlankedText(text, indices) {
    const words = text.split(' ');
    indices.forEach(index => {
        words[index] = '_____';
    });
    return words.join(' ');
}
export function isAppropriate(text) {
    // Add basic content filtering if needed
    const blacklist = ['inappropriate', 'offensive', 'terms'];
    return !blacklist.some(term => text.toLowerCase().includes(term));
}
