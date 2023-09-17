import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { uploadImage, uploadPost } from "../Home/action/UploadAction";
import { BsCloudUpload } from "react-icons/bs";
const PostShareforNav = () => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.postReducer.uploading);
  const [image, setImage] = useState(null);
  const desc = useRef();
  const imageRef = useRef();

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!desc.current.value.trim() || !image) {
      if (!desc.current.value.trim())
        alert("Please write something About your Post"); // Show an alert
      if (!image) alert("Please Add a video Or Photo about it"); // Show an alert

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
    <div>
      <div className=" p-2 bg-white rounded-md w-[20rem] text-center">
        <h1 className="text-lg m-2">Create New Post</h1>
        <div className="h-[0.2px] w-full bg-black"></div>
        <div className="">
          <input
            type="text"
            className="w-[89%] border-2 p-1 rounded-lg text-lg mt-6"
            placeholder="What is happening"
            ref={desc}
            required
          />
        </div>
        {!image ? (
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-[89%] m-auto h-40 mt-5 border-2 border-dotted border-gray-200  rounded-lg cursor-pointer  "
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
              <div onClick={() => imageRef.current.click()}>
                <BsCloudUpload className="w-[90%] m-auto h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <input
                  type="file"
                  className="hidden"
                  name="my Image"
                  ref={imageRef}
                  onChange={onImageChange}
                />
              </div>
            </div>
          </label>
        ) : (
          <div className="relative">
            <RxCross2
              onClick={() => {
                setImage(null);
              }}
              className="absolute right-[1.5rem] top-[0.3rem] text-xl cursor-pointer border-2 rounded-full border-gray-500"
            />
            {/* <img className='w-[100%] max-h-[20rem] object-cover rounded-[0.5rem]'src={image.image} alt="" /> */}
            <img
              className=" m-auto w-[89%] h-40  mt-5 border-2 object-cover rounded-[0.5rem]"
              src={URL.createObjectURL(image)}
              alt="preview"
            />
          </div>
        )}

        <button
          className="p-2 mb-7 mt-8 text-sm bg-slate-400 m-auto w-[90%] rounded-sm text-center hover:cursor-pointer hover:bg-slate-300 "
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "uploading" : "Share"}
        </button>
      </div>
    </div>
  );
};

export default PostShareforNav;
