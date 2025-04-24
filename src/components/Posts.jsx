import React from 'react'
import useGetPosts from '../hooks/useGetPosts'
import Post from './Post';

const Posts = ({selectedCategory}) => {
    const {posts ,isLoading}=useGetPosts(selectedCategory);
    if (isLoading) return <p className="text-white">Loading ....</p>;
 
  return (
    <>
   { posts.length > 0 && posts.map((post) => <Post key={post.id} post={post} />)}

    {posts.length === 0 && (
        <div className="flex flex-col items-center  h-screen">
            <p className="text-white text-lg">No posts available</p>
           
            <p className="text-white text-lg">Be the First one to Post in this Field !</p>
        </div>
    )}
    </>
  )
}

export default Posts