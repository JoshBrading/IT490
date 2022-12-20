import React from "react";
import { types as Rabbit } from "../util/rabbit";
import Axios from "axios";

const FriendForm = () => {
  const [user, setUser] = React.useState(null);

  const sendFriendReq = () => {
    Axios.post("http://localhost:3001/api/userRequest", user).then((res) => {
      if (res.data.success) {
        console.log("Friend request sent successfully");
      } else {
        console.log("Error sending friend request");
      }
    });
  };

  return (
    <div className="w-32 flex flex-col">
      <label for="uname">
        <b>Add Friend</b>
      </label>
      <input
        className="bg-gray-300"
        type="text"
        id="uname"
        name="uname"
        placeholder="Username"
        onChange={(event) => {
          setUser({ ...user, username: event.target.value });
        }}
      />
      <button
        onClick={sendFriendReq}
        className="my-1 bg-blue-400 hover:bg-blue-700 text-white py-0.5 px-2 rounded"
        type="submit"
      >
        Add Friend
      </button>
    </div>
  );
};
export default FriendForm;
