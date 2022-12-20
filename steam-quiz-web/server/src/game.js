import _ from "lodash";
import { Server } from "socket.io";

import { Rabbit, RabbitTypes } from "./rabbit.js";

var game_list = {};

Rabbit.sendRequest({ type: RabbitTypes.game.get_all_steam_games }).then(
  (response) => {
    console.log(JSON.parse(response));
    game_list = JSON.parse(response);
  }
);

// Object to store the state of each game
const state = {};

// Object to store the lobby ID for each client
const lobbies = {};

// Maximum number of players allowed in a single game
const MAX_PLAYERS = 4;

/**
 * Generates a random 5 character string including numbers and letters
 */
function lobby_code() {
  var code = "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Generate the random string
  for (var i = 0; i < 5; i++)
    code += chars.charAt(Math.floor(Math.random() * chars.length));

  return code;
}

// Initialize the Socket.io server
const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (client) => {
  // Set up event listeners for each client
  client.on("new_game", new_game);
  client.on("join_game", join_game);
  client.on("start_game", start_game);
  client.on("submit_answer", submit_answer);

  /**
   * Allows a client to join an existing game by specifying the lobby ID
   * @param {string} lobby_id The unique ID of the game to join
   */
  function join_game(lobby_id) {
    // Get the list of clients in the specified lobby
    const lobby = io.sockets.adapter.rooms[lobby_id];

    let all_users;
    if (lobby) {
      all_users = lobby.sockets;
      console.log(all_users);
    }

    let num_clients = 0;
    if (all_users) {
      num_clients = Object.keys(all_users).length;
    }

    // Check if the lobby is full
    if (num_clients >= MAX_PLAYERS) {
      client.emit("error", "Lobby is full");
      return;
    }

    // Add the client to the lobby and assign them a unique number
    lobbies[client.id] = lobby_id;
    const player_number = num_clients + 1;
    client.join(lobby_id);
    client.number = player_number;
    client.emit("init", player_number);
  }

  /**
   * Creates a new game for the client and sends them the lobby ID
   */
  function new_game() {
    let lobby_id = lobby_code();
    lobbies[client.id] = lobby_id;
    client.emit("game_code", lobby_id);

    // Assign the player the number 1
    client.number = 1;
    client.join(lobby_id);
    client.emit("init", 1);
    console.log("Creating with ID: " + lobby_id);
    console.log("ClientID: " + client.id);
  }

  /**
   * Initializes the game state and sends the first question to all players
   **/
  function start_game() {
    console.log("Start game event received");
    console.log(lobbies);

    const lobby_id = lobbies[client.id];
    console.log(client.id);
    if (!lobby_id) {
      return;
    }
    console.log("Sending questions to lobby:", lobby_id);
    

    const questions = build_quiz(4);
    // Initialize the game state and send the first question to all players
    state[lobby_id] = {
      current_question: 0,
      questions: questions,
      players: {},
    };
    io.to(lobby_id).emit("next_question", state[lobby_id]);
    // Initialize each player's score to 0
    const players = io.sockets.adapter.rooms.get(lobby_id);
    for (const player in players) {
      state[lobby_id].players[players[player].number] = {
        score: 0,
      };
    }

    emit_question(lobby_id, state[lobby_id].current_question);
  }

  /**
   * Submits an answer to the current question and checks if it is correct
   * @param {string} answer The answer to the current question
   */
  function submit_answer(answer) {
    const lobby_id = lobbies[client.id];
    if (!lobby_id) {
      return;
    }

    // Check if the answer is correct
    const current_question = state[lobby_id].current_question;
    const correct_answer =
      state[lobby_id].questions[current_question].correct_answer;
    if (answer === correct_answer) {
      // Increment the player's score if the answer is correct
      const player_number = client.number;
      //state[lobby_id].players[player_number].score++;
    }

    // Advance to the next question
    state[lobby_id].current_question++;
    console.log(state[lobby_id].questions.length);
    // Check if the game is over
    if (state[lobby_id].current_question >= state[lobby_id].questions.length) {
      // Send the final scores to all players
      io.in(lobby_id).emit("game_over", state[lobby_id].players);
      return;
    }

    //state[lobby_id].current_question = state[lobby_id].current_question ++;
    io.to(lobby_id).emit("next_question", state[lobby_id]);
    // Send the next question to all players
    emit_question(lobby_id, state[lobby_id].current_question);
  }

  /**
   * Sends the current question to all players in the specified lobby
   * @param {string} lobby_id The unique ID of the lobby
   * @param {number} question_number The index of the current question
   */
  function emit_question(lobby_id, question_number) {
    console.log(lobby_id, question_number);
    io.in(lobby_id).emit(
      "new_question",
      state[lobby_id].questions[question_number]
    );
  }

  /**
   * Sends the final scores to all clients in the specified lobby
   * @param {string} lobby_id The unique ID of the lobby
   * @param {object} scores An object containing the final scores for each player
   */
  function emit_game_over(lobby_id, scores) {
    // Send the final scores to all clients in the specified lobby
    io.sockets.in(lobby_id).emit("game_over", scores);
  }
});

function build_quiz(question_count) {
  var quiz = [];

  for (var i = 0; i < question_count; i++) {
    var question = {};
    // Get an array of keys in the game_list object
    let game_keys = Object.keys(game_list);

    // Shuffle the keys
    let shuffled_game_keys = _.shuffle(game_keys);

    // Select the first four shuffled keys
    let selected_game_keys = shuffled_game_keys.slice(0, 4);

    // Get the game titles corresponding to the selected keys
    let selected_game_titles = selected_game_keys.map(
      (key) => game_list[key][1]
    );

    console.log(selected_game_titles[0]);
    console.log(selected_game_titles[1]);
    console.log(selected_game_titles[2]);
    console.log(selected_game_titles[3]);

    // Select a random game title as the correct answer
    let correct_answer = _.sample(selected_game_titles);

    // Find the index of the correct answer in the selected_game_titles array
    let correct_answer_index = selected_game_titles.indexOf(correct_answer);

    // Get the corresponding key in the game_list object
    let correct_answer_key = selected_game_keys[correct_answer_index];

    // Get the description and game tags from the game_list object
    let description = game_list[correct_answer_key][2];
    let tags = game_list[correct_answer_key][3];

    question.correct_answer = correct_answer;
    question.description = description;
    question.tags = tags;
    question.answers = selected_game_titles;

    quiz.push(question);
  }
  return quiz;
}

io.listen(4000);
