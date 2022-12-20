import React from "react";
import { types as Rabbit } from "../util/rabbit";
import axios from "axios";

const GamePacks = ({username}) => {
  const [game_packs, setGamePacks] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      const data = {
        request: Rabbit.user.get_game_packs,
        username: username,
      };

      const response = await axios.post(
        "http://localhost:3001/api/userRequest",
        data
      );
      setGamePacks(response.data["packs"]);
    }

    fetchData();
  }, []);

  return (
    <div>
      <b>{username}'s Game Packs</b>
      <ul>
        {game_packs.map((game_pack) => (
          <li key={game_pack}>{game_pack}</li>
        ))}
      </ul>
    </div>
  );
}

export default GamePacks;