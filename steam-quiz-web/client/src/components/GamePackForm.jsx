import React from "react";
import { types as Rabbit } from "../util/rabbit";
import Axios from "axios";
import Select from 'react-select';
import { TagInput } from 'reactjs-tag-input';

const GamePackForm = ({username}) => {
  const [pack_name, setPack] = React.useState(null);

  const addGame = () => {

  };
  
  const newPack = () => {
    Axios.post('http://localhost:3001/userReqest', pack_name)
      .then((res) => {
      });
  };

  return (
    <div className="w-32 flex flex-col">
      <label for="game_name">
        <b>Create New Pack</b>
      </label>
      <input
        className="bg-gray-300"
        type="text"
        id="game_name"
        name="game_name"
        placeholder="Steam Game"
        onChange={(event) => {
        }}
      />
      <button
        onClick={addGame}
        className="my-1 bg-blue-400 hover:bg-blue-700 text-white py-0.5 px-2 rounded"
        type="submit"
        >
        Add Game
      </button>
      <button
        onClick={newPack}
        className="my-1 bg-blue-400 hover:bg-blue-700 text-white py-0.5 px-2 rounded"
        type="submit"
      >
        Build Pack
      </button>
    </div>
  );
};

export default GamePackForm;