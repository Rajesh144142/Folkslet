import React, { useState } from 'react';
import { Modal, useMantineTheme } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { uploadImage } from "../action/UploadAction";
import { updateUser } from "../action/UserAction";
const ProfileModal = ({ modalOpened, setModalOpened, data }) => {
  const theme = useMantineTheme();
  const { password, ...other } = data;
  const [formData, setFormData] = useState(other);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const dispatch = useDispatch();
  const param = useParams();


  const { user } = useSelector((state) => state.authReducer.authData);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      event.target.name === "profileImage"
        ? setProfileImage(img)
        : setCoverImage(img);
    }
  };

  // form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    let UserData = formData;
    console.log(UserData)
    if (profileImage) {
      const data = new FormData();
      const fileName = Date.now() + profileImage.name;
      data.append("name", fileName);
      data.append("file", profileImage);
      UserData.profilePicture = fileName;
      try {
        dispatch(uploadImage(data));
      } catch (err) {
        console.log(err);
      }
    }
    if (coverImage) {
      const data = new FormData();
      const fileName = Date.now() + coverImage.name;
      data.append("name", fileName);
      data.append("file", coverImage);
      UserData.coverPicture = fileName;
      try {
        dispatch(uploadImage(data));
      } catch (err) {
        console.log(err);
      }
    }
    console.log(UserData)
    dispatch(updateUser(param.id, UserData));
    setModalOpened(false);
  };

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        overlayProps={{
          color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.55,

          blur: 3,
        }}
      >
        <form className="" onSubmit={handleSubmit}>
          <h3 className='font-bold text-center p-2 text-2xl'>Your info</h3>

          <div className='flex justify-around items-center gap-2'>
            <div className=''>
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                className="border-2  border-gray-50 p-2 text-center rounded-md bg-gray-50"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>
            <div className=''>

              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                className="p-2 border-2  border-gray-50 text-center rounded-md bg-gray-50"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className=' '>
            <label htmlFor="WorksAt">Works At</label>
            <input
              value={formData.worksAt}
              type="text"
              name="worksAt"
              className="p-2 border-2 border-gray-50 text-center w-[100%] rounded-md bg-gray-50"
              placeholder="Works at" 
              onChange={handleChange}
            />
          </div>

          <div className=''>
            <label htmlFor="livesin">Lives in</label>
            <input
              value={formData.livesin}

              type="text"
              className="p-2 border-2 w-[100%] border-gray-50  text-center rounded-md bg-gray-50"
              name="livesin"
              placeholder="LIves in"
              onChange={handleChange}
            />
          </div>
          <div className=''>
            <label htmlFor="country">Country</label>
            <input
              type="text"
              value={formData.country}
              className="p-2 border-2 w-[100%] border-gray-50 text-center rounded-md bg-gray-50"
              name="country"
              onChange={handleChange}
            />
          </div>
          <div className=''>
            <label htmlFor="relationship">Relationship Status</label>

            <input
              value={formData.relationship}
              name="relationship"
              type="text"
              className="p-2 border-2 border-gray-50 w-[100%] text-center rounded-md bg-gray-50"
              placeholder="RelationShip Status" onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="about">Tell Us About YourSelf</label>
            <input
              value={formData.about}
              name="about"
              type="text"
              className="p-2 border-2 border-gray-50 w-[100%] text-center rounded-md bg-gray-50"
              placeholder="About YourSelf" onChange={handleChange}
            />
          </div>


          <div className='flex items-center font-semibold m-auto text-[17.3px] w-[90%] h-[2rem] gap-[1rem] mt-[1rem]'>
            Profile Image
            <input type="file" name='profileImage' onChange={onImageChange} />
            Cover Image
            <input type="file" name="coverImage" onChange={onImageChange} />
          </div>
          <span className='flex flex-col items-start mt-5'>
          <span className='text-sm text-red-600 '> {profileImage?'*Profile Image is selected':'* Profile image is not selected yet' }</span>
          <span className='text-sm text-red-600'> {coverImage?'*Cover Image is selected':'*Cover image is not selected yet' }</span>
          </span>

          <div className='w-[20%] m-auto mt-[2rem]'>
            <button type="submit" className="p-1 pl-4 pr-4 bg-gray-50 rounded-2xl">Update</button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProfileModal;
