import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./components/home";
import Auth from "./components/Auth";
import Profile from "./Home/Profile/profile";
import { useSelector } from "react-redux";
import Navbar from "./Home/navbar";
import Message from "./Home/Message/Message";
import Upcoming from "./Home/NewFeatures/Upcomingfeatures";

const App = () => {
  const user = useSelector((state) => state.authReducer.authData);
  const location = useLocation();

  // Define a boolean variable to determine if the Navbar should be shown
  const showNavbar = user && location.pathname !== "/chat";
  const chatting = location.pathname === "/chat";
  return (
    <div>
      <div className="flex sm:flex md:flex lg:hidden">
        {showNavbar ? <Navbar /> : null}
      </div>
      <div className="hidden sm:flex md:flex lg:flex">
        {chatting ? <Navbar /> : null}
      </div>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="home" /> : <Navigate to="/auth/signup" />
          }
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="../auth/signup" />}
        />
        <Route
          path="/auth/signup"
          element={user ? <Navigate to="../home" /> : <Auth />}
        />
        <Route
          path="/profile/:id"
          element={user ? <Profile /> : <Navigate to="../auth/signup/" />}
        />
        <Route
          path="/chat"
          element={user ? <Message /> : <Navigate to="../auth/signup/" />}
        />

        <Route
          path="/Upcoming"
          element={user ? <Upcoming /> : <Navigate to="../auth/signup/" />}
        />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
