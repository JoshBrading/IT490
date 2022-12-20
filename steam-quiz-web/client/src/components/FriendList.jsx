import React from "react";
import { types as Rabbit } from "../util/rabbit";
import axios from "axios";

const FriendList = ({username}) => {
  const [friends, setFriends] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      const data = {
        request: Rabbit.user.get_friends,
        username: username,
      };

      const response = await axios.post(
        "http://localhost:3001/api/userRequest",
        data
      );
      setFriends(response.data["friends"]);
    }

    fetchData();
  }, []);

  return (
    <div>
      <b>{username}'s Friends</b>
      <ul>
        {friends.map((friend) => (
          <li key={friend}>{friend}</li>
        ))}
      </ul>
    </div>
  );
}

export default FriendList;
