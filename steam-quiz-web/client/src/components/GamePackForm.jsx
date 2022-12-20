import React from "react";
import {types as Rabbit} from "../util/rabbit";
import Axios from "axios";
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
//import { TagInput } from 'reactjs-tag-input';

const GamePackForm = ({username}) => {
    const [pack_name, setPack] = React.useState(null);
    const [games, setGames] = React.useState([]);
    const [selectedGames, setSelectedGames] = React.useState([]);

    Axios.post('http://localhost:3001/api/gameRequest', {request: "get_steam_game_short"}).then((res) => {
          if(res.data["success"] == true) {
            for(const game in res.data["games"]) {
              //console.log({label: res.data['games'][game]['name'], value: res.data['games'][game]['id']});
                games.push({label: res.data['games'][game]['name'], value: res.data['games'][game]['id']});
            }
          }
        });

    const handleGameChange = (game) => {
        setSelectedGames(game);
        console.log(selectedGames);
        console.log(pack_name)
    };

    const newPack = () => {
      console.log(selectedGames);
      console.log(pack_name)
      const data = {
        request: Rabbit.user.add_game_pack,
        username: window.localStorage.getItem("username"),
        name: pack_name,
        games: selectedGames
      }
      Axios.post('http://localhost:3001/api/userRequest', data).then((res) => {
        if(res.data["success"] == true) {
          console.log("Pack created successfully");
        }
      });

    };

    return (
        <div className="w-96 flex flex-col">
            <label for="game_name">
                <b>Create New Pack</b>
            </label>
            <input
                className="bg-gray-300"
                type="text"
                id="game_name"
                name="game_name"
                placeholder="Pack Title"
                onChange={(event) => {setPack({name: event.target.value })}}/>
            <button
                onClick={newPack}
                className="my-1 bg-blue-400 hover:bg-blue-700 text-white py-0.5 px-2 rounded"
                type="submit">
                Build Pack
            </button>
            <Select onChange={handleGameChange} closeMenuOnSelect={false} components={makeAnimated()} isMulti="isMulti" options={games}/>
            
        </div>
    );
};

export default GamePackForm;