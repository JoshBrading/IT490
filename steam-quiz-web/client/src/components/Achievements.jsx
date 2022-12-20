import { useState, useEffect } from "react";
import { types as Rabbit } from "../util/rabbit";
import axios from "axios";

function Achievements({ username }) {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = {
        request: Rabbit.user.get_achievements,
        username: username,
      };

      const response = await axios.post(
        "http://localhost:3001/api/userRequest",
        data
      );
      setAchievements(response.data["achievements"]);
    }

    fetchData();
  }, []);

  return (
    <div>
      <b>{username}'s Achievements</b>
      <ul>
        {achievements.map((achi) => (
          <li key={achi}>{achi}</li>
        ))}
      </ul>
    </div>
  );
}

export default Achievements;