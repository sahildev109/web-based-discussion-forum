import React, { useState } from 'react'
import usePostAnswer from '../hooks/usePostAnswer'

const PostComment = ({post}) => {
    const [answer, setAnswer] = useState('')
    const {isAnswering, handlePostAnswer} = usePostAnswer()
    const handleAnswer= async()=>{
if(answer.length === 0){
    alert("Please write an answer")
    return
}
        await handlePostAnswer(post.postId, answer);
              setAnswer("");
      }
   
  return (
 <>
 
 <div className='relative w-full'>
<input type="text" placeholder='Write your Answer ....' className='border-b border-gray-700 pl-0 p-4 focus:outline-none w-full' value={answer} onChange={(e)=>setAnswer(e.target.value)}/>

<button className='absolute bg-yellow-500 rounded-md text-black px-2 py-1 text-sm font-bold right-2 m-4 hover:cursor-pointer' onClick={handleAnswer} disabled={isAnswering}  >{isAnswering ? "Posting..." : "Post"}</button>
</div>
 </>
  )
}

export default PostComment