import React from "react";
import Layout from "./components/Layout";
import Register from "./components/Register";
import Game from "./views/Game";
import Home from "./views/Home";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./views/Profile";
import NoMatch from "./views/NoMatch";
import Launchpad from "./views/Launchpad";

function App() {
  return (
    <div className="h-screen w-screen">
      <Layout>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/lobbies" element={<Launchpad/>}/>
          <Route path="/register" element={<Register/>} />
          <Route path="/user/:user/" element={<Profile/>} />
          <Route path="/game" element={<Game />} />
          <Route path="*" element={<NoMatch/>} />
        </Routes>
      </Router>
      </Layout>
    </div>
  );
}

export default App;
