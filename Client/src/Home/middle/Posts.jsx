import React, { useEffect, useMemo } from 'react';
import { getTimelinePosts } from '../action/PostAction';
import Post from './post';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useRealtimePosts from '../../features/home/hooks/useRealtimePosts';

const Posts = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.authData.user); 
  const { posts, loading } = useSelector((state) => state.postReducer);
  
  useEffect(() => {
    if (user?._id) {
      dispatch(getTimelinePosts(user._id));
    }
  }, [dispatch, user?._id]);
  
  let filteredPosts = posts;
  if (params.id) {
    filteredPosts = posts.filter((post) => post.userId === params.id);
  }
  
  const postIds = useMemo(() => {
    return filteredPosts.map((post) => post._id || post.id).filter(Boolean);
  }, [filteredPosts]);
  
  useRealtimePosts(postIds);

  if (loading) return <div  className='text-center'>Fetching posts....</div>;

  if (!filteredPosts || filteredPosts.length === 0) return <div className='text-center ml-0 md:ml-10 lg:ml-0'>No Posts</div>;
  return (
    <div className="flex flex-col gap-6 ">
      {filteredPosts.map((post,id ) => (
        <div key={id}>
          
        <Post  data={post}  />     

        
        </div>// Use a unique identifier as the key
      ))}
    </div>
  );
};

export default Posts;
