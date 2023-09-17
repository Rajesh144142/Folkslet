import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GrSchedule } from "react-icons/gr";
import { BsPlusSquare } from "react-icons/bs";
import { MdOutlineLocationOn } from "react-icons/md";
// import { HiOutlinePhoto } from 'react-icons/hi2';
// import { AiOutlinePlayCircle } from 'react-icons/ai';
import { FaPhotoVideo, FaShare } from "react-icons/fa";
import { HiOutlinePhoto } from "react-icons/hi2";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, uploadPost } from "../action/UploadAction";

const postShare = ({location}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.authData.user);
  const loading = useSelector((state) => state.postReducer.uploading);
  const [image, setImage] = useState(null);
  const desc = useRef();
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;
  const imageRef = useRef();

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!desc.current.value.trim() && !image) {
      alert("Please write something before posting."); // Show an alert
      return; // Don't submit if description is empty or only whitespace
    }
    const newPost = {
      userId: user._id, // Update this line
      desc: desc.current.value,
    };
    if (image) {
      const data = new FormData();
      const fileName = Date.now() + image.name;
      data.append("name", fileName);
      data.append("file", image);
      newPost.image = fileName;
      try {
        // Upload the image first
        dispatch(uploadImage(data));

        // After the image is uploaded successfully
        // dispatch the uploadPost action

        // Reset the form after successful upload
      } catch (err) {
        console.log("Error uploading image or post:", err);
        // Handle error here
      }
    }
    // If no image, directly dispatch the uploadPost action
    dispatch(uploadPost(newPost));
    resetShare();
  };

  const resetShare = () => {
    setImage(null);
    desc.current.value = ""; // Set the value of the input element to an empty string
  };

  return (
    <div className=" flex flex-col sm:flex-row ">
      <div className={`w-[0] m-auto sm:${location==='model'?'hidden':'block w-[6px]'} lg:hidden`}></div>
      <div className="m-auto border-[1px] shadow-md gap-1rem flex-col p-1 rounded-[1rem] w-[80%] hidden  sm:hidden md:block lg:block ">
        <div className="flex p-[1rem] justify-center items-center rounded-[1rem]   gap-[1rem] ">
          {/* <img className='rounded-[50%] w-[3rem] h-[3rem] ' src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=465&q=80" alt="" /> */}
          <img
            className="border-2 rounded-[50%] w-[4rem] h-[4rem] "
            src={
              user.profilePicture
                ? serverPublic + user.profilePicture
                : serverPublic + "defaultProfile.png"
            }
            alt="Profile"
          />
          <div className="flex flex-col w-[80%] gap-[1rem]">
            <input
              className="rounded-[10px] p-[8px] font-[17px]  outline-none"
              type="text"
              placeholder="What is happening"
              ref={desc}
              required
            />
          </div>
        </div>
        <div>
          <div className="grid grid-cols-4 justify-items-cente mb-1">
            <div className=" p-[3px]  text-sm rounded-[10px] flex items-center justify-center hover:cursor-pointer hover:bg-slate-300">
              <h1 className="text-lg">
                <GrSchedule />
              </h1>
              <div className="pl-1"> Schedule</div>
            </div>
            <div className="p-[3px]  text-sm rounded-[10px] flex items-center justify-center hover:cursor-pointer hover:bg-slate-300">
              {" "}
              <h1 className="text-lg">
                <MdOutlineLocationOn />
              </h1>
              <div className="pl-1">Location </div>
            </div>
            <div
              className="p-[3px]  text-sm rounded-[10px] flex items-center justify-center hover:cursor-pointer hover:bg-slate-300"
              onClick={() => imageRef.current.click()}
            >
              {" "}
              <h1 className="text-lg">
                <HiOutlinePhoto />{" "}
              </h1>
              <div className="pl-1">Post</div>
            </div>
            <button
              onClick={handleUpload}
              disabled={loading}
              className=" pl-2  pr-2 rounded-xl bg-white text-black text-sm hover:bg-blue-500 hover:text-white"
            >
              {"  "}
              {loading ? "uploading" : "Share"}
            </button>
            <div className="hidden">
              <input
                type="file"
                name="myImage"
                ref={imageRef}
                onChange={onImageChange}
              />
            </div>
          </div>
          {image && (
            <div className="relative ">
              <RxCross2
                onClick={() => {
                  setImage(null);
                }}
                className="absolute right-[1rem] top-[0.5rem] text-xl cursor-pointer"
              />
              {/* <img className='w-[100%] max-h-[20rem] object-cover rounded-[0.5rem]'src={image.image} alt="" /> */}
              <img
                className="w-[100%] max-h-[25rem] object-cover rounded-[0.5rem]"
                src={URL.createObjectURL(image)}
                alt="preview"
              />
            </div>
          )}
        </div>
      </div>
      <div
        className="   flex left-0 right-0 top-0 bg-white items-center z-40 fixed border-b-2 sm:hidden md:hidden lg:hidden
"
      >
        <Link to="" className=" ">
          <h1 className="mx-3 text-2xl font-bold p-2 text-blue-500">
            <i>Folkslet</i>
          </h1>
        </Link>
        <div
          className="absolute right-3 pr-7 text-xl "
          onClick={() => imageRef.current.click()}
        >
          <BsPlusSquare />
        </div>
        <div className="absolute right-3 text-xl" onClick={handleUpload}>
          <FaShare />
        </div>
      </div>
      <div className="mt-6 block sm:hidden md:hidden lg:hidden  ">
        {image && (
          <div className="relative ">
            <RxCross2
              onClick={() => {
                setImage(null);
              }}
              className="absolute right-[1rem] top-[0.5rem] text-xl cursor-pointer"
            />
            {/* <img className='w-[100%] max-h-[20rem] object-cover rounded-[0.5rem]'src={image.image} alt="" /> */}
            <img
              className="w-[100%] max-h-[25rem] object-cover rounded-[0.5rem]"
              src={URL.createObjectURL(image)}
              alt="preview"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default postShare;
