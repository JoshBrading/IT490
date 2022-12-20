import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import SideBar from "./Sidebar";

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div>
      <Header setIsOpen={setIsOpen}/>
      <div className="flex">
      {/*<SideBar isOpen={isOpen} setIsOpen={setIsOpen} />*/}
      <main className="flex-grow">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
