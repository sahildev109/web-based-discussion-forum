import React from 'react'
import useGetPost from '../hooks/usegetPosts'
import Post from './Post';

const Posts = ({selectedCategory}) => {
    const {posts}=useGetPost(selectedCategory);
    // console.log(posts);
  return (
    <>
   { posts.length > 0 && posts.map((post) => <Post key={post.id} post={post} />)}
    </>
  )
}

export default Posts