import { Post } from '@devvit/public-api';

export interface ProcessedPrompt {
    originalText: string;
    blankedText: string;
    blankIndices: number[];
    blankWords: string[];
    originalAuthor: string;
}

// Words that shouldn't be removed (articles, prepositions, etc.)
const KEEP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'nor', 'for', 'yet', 'so',
    'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'from',
    'is', 'are', 'was', 'were', 'has', 'have', 'had'
]);

// Words that are good candidates for blanks
const INTERESTING_WORD_PATTERNS = [
    /^[A-Z][a-z]+/, // Capitalized words (proper nouns)
    /\d+/, // Numbers
    /^(awesome|amazing|incredible|terrible|horrible|beautiful|ugly|smart|stupid|funny|weird|strange|crazy|wild|huge|tiny)/i, // Descriptive adjectives
    /[!?]+$/, // Words with emphasis
];

export function isInterestingWord(word: string): boolean {
    // Skip short words and common words
    if (word.length < 4 || KEEP_WORDS.has(word.toLowerCase())) {
        return false;
    }

    // Check if word matches any interesting patterns
    return INTERESTING_WORD_PATTERNS.some(pattern => pattern.test(word));
}

export function selectPromptFromPosts(posts: Post[]): Post | null {
    // Filter out unsuitable posts
    const eligiblePosts = posts.filter(post => {
        if (!post.title) return false;
        
        const words = post.title.split(/\s+/);
        // Post should have enough words and interesting content
        return (
            words.length >= 8 && // Minimum length
            words.length <= 30 && // Maximum length
            words.some(isInterestingWord) && // Has interesting words
            !post.title.includes('http') && // No URLs
            !/^\[.*\]/.test(post.title) && // No tagged posts
            !/^[\d.]+/.test(post.title) // Don't start with numbers
        );
    });

    if (eligiblePosts.length === 0) return null;

    // Select a random post from eligible ones
    return eligiblePosts[Math.floor(Math.random() * eligiblePosts.length)];
}

export function processPrompt(post: Post): ProcessedPrompt {
    if (!post.title) {
        throw new Error('Post must have a title');
    }

    const words = post.title.split(/\s+/);
    const blankIndices: number[] = [];
    const blankWords: string[] = [];

    // First pass: identify all potential words to blank out
    const potentialBlanks = words.map((word, index) => ({
        word,
        index,
        interesting: isInterestingWord(word)
    })).filter(item => item.interesting);

    // Determine how many blanks to create based on sentence length
    const numBlanks = Math.min(
        Math.max(3, Math.floor(words.length / 6)), // At least 3, or 1 per 6 words
        Math.min(5, potentialBlanks.length) // Maximum 5 blanks or all potential blanks
    );

    // Randomly select words to blank out
    while (blankIndices.length < numBlanks && potentialBlanks.length > 0) {
        const randomIndex = Math.floor(Math.random() * potentialBlanks.length);
        const selected = potentialBlanks.splice(randomIndex, 1)[0];
        blankIndices.push(selected.index);
        blankWords.push(selected.word);
    }

    // Sort indices to process them in order
    blankIndices.sort((a, b) => a - b);

    // Create blanked text
    const blankedWords = [...words];
    blankIndices.forEach((index, i) => {
        blankedWords[index] = '_____';
    });

    return {
        originalText: post.title,
        blankedText: blankedWords.join(' '),
        blankIndices,
        blankWords,
        originalAuthor: post.authorName ?? '[deleted]'
    };
}

export function createGamePrompt(processedPrompt: ProcessedPrompt): string {
    return [
        `🎮 Fill in the Fun Challenge!\n`,
        `Make this post funnier by filling in the blanks:\n\n`,
        `"${processedPrompt.blankedText}"\n\n`,
        `• ${processedPrompt.blankIndices.length} blanks to fill`,
        `• Be creative and funny!`,
        `• Upvote your favorite submissions`,
        `• Original post by u/${processedPrompt.originalAuthor}\n\n`,
        `Use the "Submit Answer" button below to participate!`
    ].join('\n');
}

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export function validateSubmission(answers: string[]): ValidationResult {
    for (const answer of answers) {
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