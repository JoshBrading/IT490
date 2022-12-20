import GameWindow from "../components/GameWindow";
import QuizLobby from "../components/QuizGame";
import Hangman  from "../components/Hangman";

//<canvas id="canvas" className="w-full h-full"></canvas>
const Game = () => {
  return (
    <div className="">
      <div className="grid w-screen grid-cols-1 p-6 md:grid-cols-2 lg:grid-cols-6 2xl:grid-cols-6">
        <div className="flex justify-center border-2 border-gray-300 rounded-xl col-span-4">
          <Hangman />
        </div>
        <div className="flex justify-center bg-black border-2 border-gray-300 rounded-xl text-white h-64 col-span-2">
          <p>Placeholder for chat</p>
        </div>
      </div>
    </div>
  );
};

export default Game;
