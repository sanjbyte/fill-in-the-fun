"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gamePostType = void 0;
var public_api_1 = require("@devvit/public-api");
var state_1 = require("./state");
var gamePostType = {
    name: 'fill-in-the-fun',
    render: function (context) {
        var _a;
        var game = state_1.gameStore[(_a = context.postId) !== null && _a !== void 0 ? _a : ''];
        if (!game || !game.isActive) {
            return public_api_1.Devvit.createElement("text", null, "No active game found!");
        }
        return (public_api_1.Devvit.createElement("vstack", null,
            public_api_1.Devvit.createElement("text", null, game.blankedText),
            public_api_1.Devvit.createElement("button", { onPress: function (data) {
                    var event = data; // Cast JSONObject to expected type
                    if (event.formKey) {
                        console.log('Button pressed with formKey:', event.formKey);
                    }
                    else {
                        console.log('Button pressed with no formKey!');
                    }
                } }, "Submit")));
    },
};
exports.gamePostType = gamePostType;
