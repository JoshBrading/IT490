import Achievements from "../components/Achievements";
import GamePacks from "../components/GamePacks";
import FriendList from "../components/FriendList";
import FriendForm from "../components/FriendForm";
import GamePackForm from "../components/GamePackForm";
import Settings from "../components/Settings";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { user } = useParams();
  return (
    <div className="grid grid-cols-1 justify-center">
      <div className="flex justify-center my-6 text-2xl font-bold">
        {user}'s Profile
      </div>
      <div className="flex mx-auto">
        <div className="mx-6">
          <div>
              {user == window.localStorage.getItem("username") ? (
                <FriendForm />
              ) : (
                <div></div>
              )}
            </div>
            <FriendList username={user} />
          </div>
        <div className="mx-6">
          <Achievements username={user} />
        </div>
          
          <div className="mx-6">
          <GamePacks username={user} />
        </div>
        <div className="w-64 mx-6">
            {user == window.localStorage.getItem("username") ? (
              <GamePackForm />
            ) : (
              <div></div>
            )}
          </div>
      </div>
    </div>
  );
};

export default Profile;
