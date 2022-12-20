import React from "react";
import {types as Rabbit} from "../util/rabbit";
import Axios from "axios";

const GamePacks = ({username}) => {
  const [gamePacks, setGamePacks] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      const response = await Axios.post(
        "http://localhost:3001/api/userRequest",
        { request: Rabbit.user.get_game_packs, username }
      );
      console.log(response.data);
      if (response.data["success"]) {
        setGamePacks(response.data["packs"]);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <b>{username}'s Game Packs</b>
      <ul>
        {gamePacks.map((gamePack) => (
          <li key={gamePack}>{gamePack}</li>
        ))}
      </ul>
    </div>
  );
};

export default GamePacks;
