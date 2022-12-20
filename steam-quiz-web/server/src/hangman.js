import _ from "lodash";
import { Server } from "socket.io";

import { Rabbit, RabbitTypes } from "./rabbit.js";

const io = new Server({
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  
// Set up an array of possible words for the game
const words = ['apple', 'banana', 'grapes', 'strawberry'];

// Set up an object to store the state of the game
let game = {
  word: '',
  letters: [],
  incorrectGuesses: 0,
  correctGuesses: 0,
  gameOver: false,
  winner: false
};

const rounds = {
    played: 0,
    wins: 0,
    losses: 0
  };

  io.on("connection", (socket) => {
    console.log("A new client has connected");

    // Select a random word for the game
    game.word = words[Math.floor(Math.random() * words.length)];
    // Set up an array of underscores to represent the letters in the word
    game.letters = game
        .word
        .split("")
        .map((letter) => "_");

    // Emit the initial state of the game to the client
    socket.emit("game-state", game);

    socket.on("new-game", (games) => {
        console.log(games);
        // Select a random word for the game
        game.word = games[Math.floor(Math.random() * games.length)]['label'];
        console.log(game.word);
    });
    // Listen for a guess from the client
    socket.on("guess", (guess) => {
        // Check if the guess is correct
        if (game.word.includes(guess)) {
            // Update the state of the game with the correct guess
            for (let i = 0; i < game.word.length; i++) {
                if (game.word[i] === guess) {
                    game.letters[i] = guess;
                    game.correctGuesses++;
                }
            }
            // Check if the player has won
            if (game.correctGuesses === game.word.length) {
                game.gameOver = true;
                game.winner = true;
                game.wins++;
            }
        } else {

            // Update the state of the game with the incorrect guess
            game.incorrectGuesses++;
            // Check if the player has lost
            if (game.incorrectGuesses === 5) {
                game.gameOver = true;
                game.losses++;
            }
        }

        socket.emit("game-state", game);

    });

    // Listen for the round-over event
    socket.on("round-over", () => {
        // Check if the player has played 5 rounds
        if (game.played === 4) {
            game.gameOver = true;
        } else {
            game.played++;
        }

        // Reset the game state for the next round
        game.word = words[Math.floor(Math.random() * words.length)];
        game.letters = game
            .word
            .split("")
            .map((letter) => "_");
        game.incorrectGuesses = 0;
        game.correctGuesses = 0;
        game.gameOver = false;
        game.winner = false;

        // Emit the updated game state to the client
        socket.emit("game-state", game);
    });
});

io.listen(5000);