import { Devvit, useForm, useAsync, useState } from "@devvit/public-api";
Devvit.configure({
    redditAPI: true,
});
const FillInTheFunGame = (context) => {
    console.log("Rendering FillInTheFunGame");
    //State declarations
    const [firstBlank, setFirstBlank] = useState(null);
    const [secondBlank, setSecondBlank] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameStage, setGameStage] = useState('selectWords');
    const [blankedSentence, setBlankedSentence] = useState('');
    const [userInput1, setUserInput1] = useState('');
    const [userInput2, setUserInput2] = useState('');
    const [userAnswers, setUserAnswers] = useState({ first: '', second: '' });
    const firstBlankForm = useForm({
        fields: [
            { name: 'firstBlank', label: 'First blank', type: 'string' }
        ]
    }, (values) => {
        const firstBlank = values.firstBlank || '';
        setUserAnswers(prev => ({ ...prev, first: firstBlank }));
        setUserInput1(firstBlank);
    });
    const secondBlankForm = useForm({
        fields: [
            { name: 'secondBlank', label: 'Second blank', type: 'string' }
        ]
    }, (values) => {
        const secondBlank = values.secondBlank || '';
        setUserAnswers(prev => ({ ...prev, second: secondBlank }));
        setUserInput2(secondBlank);
    });
    const { data, loading, error } = useAsync(async () => {
        console.log("Starting async data fetch");
        try {
            const subreddit = await context.reddit.getCurrentSubreddit();
            console.log("Current subreddit:", subreddit.name);
            const topPosts = await subreddit.getTopPosts({ timeframe: "day", limit: 10 }).all();
            console.log("Fetched top posts:", topPosts.length);
            const topPost = topPosts.find((post) => post.title?.split(" ").length >= 5);
            console.log("Selected top post:", topPost ? topPost.title : "No suitable post found");
            if (topPost) {
                const result = {
                    postTitle: topPost.title,
                    eligibleWords: topPost.title.split(/\s+/).filter((word) => word.length > 3),
                };
                console.log("Async data fetch completed successfully:", result);
                return result;
            }
            else {
                throw new Error("No eligible post found.");
            }
        }
        catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }
    }, { depends: [] });
    // User has selected the words to blank out and wants to start the game
    const handleStartGame = () => {
        console.log("handleStartGame called");
        console.log("Current state:", { data, firstBlank, secondBlank, gameStarted, gameStage });
        if (!data || !data.postTitle || !firstBlank || !secondBlank) {
            console.log('Missing required data for the game to start');
            context.ui.showToast({ text: "Unable to start game. Please try again." });
            return;
        }
        console.log('Starting game with:', { firstBlank, secondBlank });
        const blanked = data.postTitle
            .replace(new RegExp(`\\b${firstBlank}\\b`, 'gi'), '_________')
            .replace(new RegExp(`\\b${secondBlank}\\b`, 'gi'), '_________');
        console.log('Blanked sentence:', blanked);
        setBlankedSentence(blanked);
        setGameStage('inputAnswers');
        setGameStarted(true);
        console.log('Game started, new state:', { blankedSentence: blanked, gameStage: 'inputAnswers', gameStarted: true });
    };
    // User has entered their guesses for the blanked words and wants to submit their answers.
    const handleSubmit = async () => {
        console.log('handleSubmit called');
        console.log('Current state:', { gameStarted, userInput1, userInput2, blankedSentence, context });
        if (!gameStarted) {
            console.log('Game not started');
            context.ui.showToast({ text: "Please start the game first." });
            return;
        }
        console.log('Word lengths:', userInput1.length, userInput2.length);
        if (userInput1.length < 4 || userInput2.length < 4) {
            console.log('Words too short');
            context.ui.showToast({ text: "Both words must be at least 4 letters long." });
            return;
        }
        if (userInput1.toLowerCase() === userInput2.toLowerCase()) {
            console.log('Words are the same');
            context.ui.showToast({ text: "Please enter two different words." });
            return;
        }
        try {
            if (!blankedSentence) {
                console.error('Blanked sentence is not available');
                throw new Error('Blanked sentence is not available');
            }
            const completeSentence = blankedSentence
                .replace('_________', userInput1)
                .replace('_________', userInput2);
            console.log('Complete sentence:', completeSentence);
            if (!context.postId) {
                console.error("Post ID is undefined.");
                context.ui.showToast({ text: "Error: Missing Post ID." });
                return;
            }
            console.log('Attempting to submit comment to post ID:', context.postId);
            await context.reddit.submitComment({
                id: context.postId,
                text: completeSentence
            });
            console.log('Comment submitted successfully');
            setUserAnswers({ first: userInput1, second: userInput2 });
            setSubmitted(true);
            setGameStage('completed');
            console.log('Game completed, new state:', { userAnswers: { first: userInput1, second: userInput2 }, submitted: true, gameStage: 'completed' });
            context.ui.showToast({ text: "Thanks for your submission!" });
        }
        catch (error) {
            console.error("Error submitting comment:", error);
            if (error instanceof Error) {
                console.error("Error message:", error.message);
                console.error("Error stack:", error.stack);
            }
            context.ui.showToast({ text: "Failed to submit your answer. Please try again." });
        }
    };
    return (Devvit.createElement("blocks", null,
        loading && Devvit.createElement("text", null, "Loading..."),
        error && Devvit.createElement("text", null,
            "Error: ",
            error.message),
        !submitted && data && (Devvit.createElement("vstack", { alignment: "center middle", padding: "small", gap: "medium" },
            Devvit.createElement("text", { size: "large", weight: "bold", color: "primary-plain", wrap: true }, data.postTitle),
            gameStage === 'selectWords' && (Devvit.createElement(Devvit.Fragment, null,
                Devvit.createElement("text", { size: "medium", weight: "bold", color: "primary-plain", alignment: "center" },
                    "Select the first blank: ",
                    firstBlank),
                Devvit.createElement("hstack", { alignment: "center middle", gap: "small" }, data.eligibleWords.map((word) => (Devvit.createElement("button", { key: `first-${word}`, appearance: firstBlank === word ? "primary" : "plain", size: "small", onPress: () => setFirstBlank(word) }, word)))),
                Devvit.createElement("text", { size: "medium", weight: "bold", color: "primary-plain" },
                    "Select the second blank: ",
                    secondBlank),
                Devvit.createElement("hstack", { alignment: "center middle", gap: "small" }, data.eligibleWords.map((word) => (Devvit.createElement("button", { key: `second-${word}`, appearance: secondBlank === word ? "primary" : "plain", size: "small", onPress: () => setSecondBlank(word) }, word)))),
                Devvit.createElement("button", { key: "submit-word-button", size: "small", appearance: "success", icon: "send", onPress: handleStartGame }, "Submit Words"))),
            gameStage === 'inputAnswers' && (Devvit.createElement("vstack", { alignment: "center middle", padding: "small", gap: "medium" },
                Devvit.createElement("text", { size: "medium", color: "primary-plain" }, data.postTitle.split(' ').map(word => word === firstBlank || word === secondBlank ? '____' : word).join(' ')),
                Devvit.createElement("hstack", { alignment: "center middle", gap: "small" },
                    Devvit.createElement("text", null, "First blank:"),
                    Devvit.createElement("button", { onPress: () => context.ui.showForm(firstBlankForm) }, userAnswers.first || "Enter first word")),
                Devvit.createElement("hstack", { alignment: "center middle", gap: "small" },
                    Devvit.createElement("text", null, "Second blank:"),
                    Devvit.createElement("button", { onPress: () => context.ui.showForm(secondBlankForm) }, userAnswers.second || "Enter second word")),
                Devvit.createElement("button", { key: "submit-answers-button", size: "small", appearance: "success", icon: "send", onPress: handleSubmit }, "Submit Answer"))))),
        !submitted && !data && !loading && !error && (Devvit.createElement("vstack", { alignment: "center middle", height: "100%" },
            Devvit.createElement("text", { size: "medium", weight: "bold", color: "primary-plain" }, "No data available"))),
        submitted && (Devvit.createElement("vstack", { alignment: "center middle", height: "100%" },
            Devvit.createElement("text", { size: "medium", weight: "bold", color: "primary-plain" }, "Thanks for your submission! Check the comments to see your completed sentence.")))));
};
Devvit.addMenuItem({
    label: "Start Fill-in-the-Fun Game",
    location: "subreddit",
    forUserType: "moderator",
    onPress: async (event, context) => {
        try {
            const subredditName = (await context.reddit.getCurrentSubreddit()).name;
            await context.reddit.submitPost({
                subredditName,
                title: "Welcome to Fill in the Fun game! Answers with most upvote wins!", // Explicit title
                preview: (Devvit.createElement("vstack", { alignment: "center middle", padding: "xsmall" },
                    Devvit.createElement("text", { size: "large" }, "Loading game..."))),
            });
            context.ui.showToast({ text: "Game post created. Select words to blank." });
        }
        catch (error) {
            console.error("Error starting game:", error);
            context.ui.showToast({ text: "Failed to start the game." });
        }
    },
});
console.log("Initializing FillInTheFunGame custom post type");
Devvit.addCustomPostType({
    name: "FillInTheFunGame",
    render: FillInTheFunGame
});
export default Devvit;
