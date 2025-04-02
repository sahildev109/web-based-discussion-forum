import React from 'react'
import useGetPosts from '../hooks/usegetPosts'
import Post from './Post';

const Posts = ({selectedCategory}) => {
    const {posts}=useGetPosts(selectedCategory);
    // console.log(posts);
  return (
    <>
   { posts.length > 0 && posts.map((post) => <Post key={post.id} post={post} />)}
    </>
  )
}

export default Posts