import React from 'react'
import useGetUserProfileById from '../hooks/useGetUserById'
import { timeAgo } from '../utils/timeAgo'

const Comment = ({comment,index}) => {
    const {userProfile,isLoading} = useGetUserProfileById(comment.createdBy)
  if (isLoading){
    return <p className='text-white '>Loading...</p>
  }
  return (
   <>
   <div key={index} className="p-3 bg-gray-800 rounded-lg">

<p className="text-sm">{comment.answer}</p>
<span className="text-xs text-gray-400">{userProfile.username} • {timeAgo(comment.createdAt)}</span>
</div>
   </>
  )
}

export default Comment