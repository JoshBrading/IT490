import LobbyForm from "../components/LobbyForm";
import LobbyList from "../components/LobbyList";
import GamePacks from "../components/GamePacks";
import SteamImportForm from "../components/SteamImportForm";

const Launchpad = () => {
    return (
      <div className="w-screen items-center">
        <div className="mb-6 text-2xl font-bold flex justify-center">
          Steam-Tag
        </div>
        <div className="grid w-screen grid-cols-3">
        </div>
      </div>
    );
  };
  
  export default Launchpad;
