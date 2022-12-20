import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Header = ({ setIsOpen }) => {
  return (
    <div className="flex h-16 w-full bg-blue-500 items-center columns-3">
      {/*<button
        className="flex px-8 items-center float-left justify-center h-10 w-10 text-white border-2 border-white border-opacity-50 rounded-md text-4xl"
        onClick={() => setIsOpen(true)}
      >
        <FontAwesomeIcon icon={faBars} />
  </button>*/}

      <h1 className="text-white text-4xl">Steam-Tag Quiz!</h1>
      <div className="my-3 float-right">
        <button
          className="h-10 w-10 text-white border-2 border-white border-opacity-50 rounded-full text-xl bg-gray-500"
          onClick={() => setIsOpen(true)}
        >
          <FontAwesomeIcon icon={faUser} />
        </button>
      </div>
    </div>
  );
};

export default Header;
