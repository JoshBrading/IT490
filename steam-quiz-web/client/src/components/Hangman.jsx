import React, { useState, useEffect, useRef } from "react";
import { types as Rabbit } from "../util/rabbit";
import Axios from "axios";
import io from "socket.io-client";

import Select, { components } from "react-select";
import makeAnimated from "react-select/animated";

const socket = io("http://localhost:5000");

const Hangman = () => {
  const [gamePacks, setGamePacks] = React.useState([]);
  const [selectedGamePacks, setSelectedGamePacks] = React.useState([]);
  const [roundOver, setRoundOver] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [guess, setGuess] = useState("");
  const [showGame, setShowGame] = useState(false); // added
  const [game, setGame] = useState({
    word: "",
    letters: [],
    incorrectGuesses: 0,
    correctGuesses: 0,
    gameOver: false,
    winner: false,
    played: 0,
    wins: 0,
    losses: 0,
  });

  useEffect(() => {
    async function fetchGamePacks() {
      const res = await Axios.post("http://localhost:3001/api/userRequest", {
        request: "get_game_packs",
        username: window.localStorage.getItem("username"),
      });
      if (res.data["success"] == true) {
        setGamePacks(
          res.data["packs"].map((pack, i) => ({ label: pack, value: i }))
        );
      }
    }
    fetchGamePacks();
  }, []);

  const handleGameList = (game) => {
    setSelectedGamePacks(game);
    console.log(selectedGamePacks);
  };

  useEffect(() => {
    socket.on("game-state", (data) => {
      setGame(data);
      setRoundOver(data.gameOver || data.winner || data.incorrectGuesses === 5);
      setGameOver(data.gameOver); // modified
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    setGuess(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send the guess to the server
    socket.emit("guess", guess);
    console.log(game.incorrectGuesses);
    // Clear the input field
    setGuess("");
  };

  return (
    <div>
      <h1>Hangman</h1>
      {!showGame ? (
        <div className="w-64">
          <button
            onClick={() => {
                setShowGame(true);
                socket.emit("new-game", selectedGamePacks);
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Game
          </button>
          <Select
            onChange={handleGameList}
            closeMenuOnSelect={false}
            components={makeAnimated()}
            isMulti="isMulti"
            options={gamePacks}
          />
        </div>
      ) : (
        <div>
          {roundOver ? (
            game.winner ? (
              <p>
                You won! You have {game.wins}
                wins and {game.losses}
                losses.
              </p>
            ) : (
              <p>
                You lost. You have {game.wins}
                wins and {game.losses}
                losses.
              </p>
            )
          ) : roundOver ? (
            <div>
              <p>Round over!</p>
              <button
                onClick={() => {
                  setRoundOver(false);
                  setGameOver(false);
                  socket.emit("new-game");
                }}
              >
                Play again
              </button>
            </div>
          ) : (
            <div>
              <p>{game.letters.join(" ")}</p>
              <p>Incorrect Guesses: {game.incorrectGuesses}/5</p>
              <form onSubmit={handleSubmit}>
                <label>
                  Guess a letter:
                  <input type="text" value={guess} onChange={handleChange} />
                </label>
                <button type="submit">Guess</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Hangman;
