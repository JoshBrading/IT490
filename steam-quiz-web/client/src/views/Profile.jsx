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
    <div className="w-screen items-center">
      <div className="mb-6 text-2xl font-bold flex justify-center">
        {user}'s Profile
      </div>
      <div className="grid w-screen grid-cols-3">
        <div>
        <div>
            {user == window.localStorage.getItem("username") ? (
              <FriendForm />
            ) : (
              <div></div>
            )}
          </div>
          <FriendList username={user} />
        </div>
        <div>
          <Achievements username={user} />
        </div>
        <div>
          <div>
            {user == window.localStorage.getItem("username") ? (
              <GamePackForm />
            ) : (
              <div></div>
            )}
          </div>
          <GamePacks username={user} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
