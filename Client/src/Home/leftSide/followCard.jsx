import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllUser } from "../api/UserRequests.jsx";
import FollowersModal from "./followersModel.jsx";
import User from "../User.jsx";
import { useParams } from "react-router-dom";
const FollowCard = ({ location }) => {
  const param=useParams()
  const home=param;
  const [modalOpened, setModalOpened] = useState(false);
  const [persons, setPersons] = useState([]);
  const { user } = useSelector((state) => state.authReducer.authData);
const [showmore,setshowmore]=useState(false)
console.log(home.id===user._id)

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const { data } = await getAllUser();
        setPersons(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchPersons();
  }, []);
  const initialDisplayUsers = persons.slice(0, 4);

  // Handle "Show more" button click
  const handleShowMoreClick = () => {
    if (!modalOpened) {
      setModalOpened(true); // Open the modal to show all users
    }
  };

  // Render different content based on the location prop
  const renderContent = () => {
    if (location === "modal") {
      // Render specific content for the 'modal' location
      return (
        <div className="">
          <div className="font-bold text-[15px] text-center ">
            <h3>People you may know</h3>
          </div>
          {showmore?<div>
          {persons.map((person, id) => {
            if (person._id !== user._id )
              return <User person={person} key={id} />;
            return null;
          })}</div>:<div>{persons.map((person, id) => {
            if (person._id !== user._id && id<5)
              return <User person={person} key={id} />;
            return null;
          })}</div>}

          {/* Show more button */}
          <button
            className={`text-center p-1 mx-auto w-[30%]  font-bold bg-slate-50 rounded-xl ${showmore?'hidden':'block'}`}
            onClick={()=>{setshowmore(true)}}
          >
            Show more
          </button>
        </div>
      );
    } else {
      // Render default content for other locations
      return (
        <div className={`shadow-sm p-2 w-full border-2 rounded-[0.7rem] gap-[1rem]  flex-col text-[13px] ${home.id===user._id?'block':'hidden'} md:flex lg:flex`}>
          <div className="font-bold text-[15px] text-center">
            <h3>People you may know</h3>
          </div>
          {initialDisplayUsers.map((person, id) => {
            if (person._id !== user._id)
              return <User person={person} key={id} />;
            return null;
          })}

          {/* Show more button */}
          <button
            className="text-center p-1 m-auto md:w-[50%] lg:w-[30%] font-bold bg-slate-50 rounded-xl"
            onClick={handleShowMoreClick}
          >
            Show more
          </button>

          {/* Render the FollowersModal component */}
          <FollowersModal
            modalOpened={modalOpened}
            setModalOpened={setModalOpened}
            allUsers={persons}
          />
        </div>
      );
    }
  };

  return renderContent();
};

export default FollowCard;
