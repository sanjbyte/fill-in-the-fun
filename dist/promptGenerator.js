import { randomElement, getRandomSorting, PHASE_SUBMISSION } from './utils';
import { setState } from './state';
const SUBREDDIT = 'WordRelay'; // Update this to your desired subreddit
async function fetchAndCreatePrompt(api) {
    const sort = getRandomSorting();
    const posts = await api.getPosts({ subreddit: SUBREDDIT, sort, limit: 10 }) ?? [];
    if (!posts || posts.length === 0) {
        return "Monica cleaned the entire apartment until it __[BLANK]__.";
    }
    const chosenPost = randomElement(posts);
    let sentence = chosenPost.title;
    if (sentence.split(' ').length < 5) {
        const comments = await api.getComments({ subreddit: SUBREDDIT, postId: chosenPost.id, limit: 10 }) ?? [];
        if (comments && comments.length > 0) {
            const chosenComment = randomElement(comments);
            sentence = chosenComment.body || sentence;
        }
    }
    const words = sentence.split(' ');
    if (words.length > 3) {
        const idx = Math.floor(Math.random() * words.length);
        words[idx] = '__[BLANK]__';
        return words.join(' ');
    }
    else {
        return "Chandler couldn’t stop laughing when Joey tried to play the __[BLANK]__.";
    }
}
export async function dailyPromptUpdate(context) {
    const { api, kv } = context;
    const prompt = await fetchAndCreatePrompt(api);
    await setState(kv, { prompt, phase: PHASE_SUBMISSION, submissions: [] });
}
//# sourceMappingURL=promptGenerator.js.map