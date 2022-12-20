const SideBar = ({ children, isOpen, setIsOpen }) => {
  return (
    <div
      className={" fixed overflow-hidden z-10 bg-gray-900 bg-opacity-25 inset-0 " + (isOpen ? "" : "hidden  ")}>
      <div className={ "w-screen max-w-lg absolute bg-blue-500 h-full shadow-xl"} >
        <div className="relative w-screen max-w-lg flex flex-col overflow-y-scroll h-full">
          <h1 className="p-4 font-bold text-lg">h1</h1>
          
        </div>
      </div>
      <div className="w-screen h-full cursor-pointer" onClick={() => { setIsOpen(false); }}></div>
    </div>
  );
};

export default SideBar;
