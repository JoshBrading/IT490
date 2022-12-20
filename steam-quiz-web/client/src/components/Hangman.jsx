import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Hangman = () => {
  const [game, setGame] = useState({});
  const [roundOver, setRoundOver] = useState(false);  // added
  const [guess, setGuess] = useState('');

  useEffect(() => {
    
    socket.on('game-state', data => {
      setGame(data);
      setRoundOver(data.gameOver || data.winner || data.incorrectGuesses === 5);  // modified
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = e => {
    setGuess(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Send the guess to the server
    socket.emit('guess', guess);
    // Clear the input field
    setGuess('');
  };

  return (
    <div>
      <h1>Hangman</h1>
      {roundOver ? (
        game.winner ? (
          <p>You win!</p>
        ) : (
          <p>You lose!</p>
        )
      ) : game.letters ? (
        <>
          <p>Incorrect guesses: {game.incorrectGuesses}</p>
          <p>
            {game.letters.map((letter, i) => (
              <span key={i}>{letter}</span>
            ))}
          </p>
          {!roundOver && (  // added
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={guess}
                onChange={handleChange}
                maxLength={1}
              />
              <button type="submit">Guess</button>
            </form>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
      <p>
        Rounds played: {game.played} ({game.wins} wins, {game.losses} losses)
      </p>
    </div>
    
    );
};

export default Hangman;
 
