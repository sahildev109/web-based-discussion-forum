import React, { useEffect, useRef, useState } from 'react'
import useGetUserProfileById from '../hooks/useGetUserById'
import { ArrowDown, ArrowUp, MessageCircle, Share, UserPlus, X } from 'lucide-react'
import { timeAgo } from '../utils/timeAgo'
import useLikePost from '../hooks/useLikePost'
import PostComment from './PostComment'
import Comment from './Comment'
import AuthStore from '../store/AuthStore'
import useAddFriendReq from '../hooks/useAddFriendReq'
import { auth, firestore } from '../firebase/firebase'
import useGetUserById from '../hooks/useGetUserById'
import { doc, onSnapshot } from 'firebase/firestore'

const Post = ({post}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const authUser = AuthStore((state) => state.user);
   console.log(authUser.uid)
    
const { sendFriendRequest, sending, isFriend } = useAddFriendReq( { 
  senderId: authUser.uid,
  receiverId: post.createdBy
}
);

    const modalRef = useRef(null);
    const [livePost, setLivePost] = useState(post);

useEffect(() => {
  if (!isOpen) return;

  const unsub = onSnapshot(doc(firestore, "posts", post.id), (docSnap) => {
    if (docSnap.exists()) {
      setLivePost({ id: docSnap.id, ...docSnap.data() });
    }
  });

  return () => unsub();
}, [isOpen]);


    useEffect(() => {
        const handleClickOutside = (event) => {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        };
    
        if (isOpen) {
          document.addEventListener("mousedown", handleClickOutside);
        }
    
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [isOpen]); 
  
      const { userProfile: authorProfile, isLoading: loadingAuthor } = useGetUserById(post.createdBy);
      const { userProfile: currentUserProfile, isLoading: loadingCurrentUser } = useGetUserById(authUser?.uid);
    const {isUpvoted, upvotes, handleLikePost, isUpdating }=useLikePost(post); 
    if( loadingAuthor || loadingCurrentUser ){
        return <p className='text-white '>Loading...</p>
    }
 
  return (
    <>

   

    <div key={post.id} className="p-4 bg-gray-800 shadow-md rounded-2xl m-3 hover:scale-104 transition" >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={'https://icons.veryicon.com/png/o/miscellaneous/common-icons-31/default-avatar-2.png'} alt="avatar" className="w-10 h-10 rounded-full" />
              <div>
                <h4 className="font-semibold text-white">{authorProfile.username}</h4>
                <p className="text-sm text-gray-500">{timeAgo(post.createdAt)}</p>
              </div>
            </div>
            {!isFriend && post.createdBy !== authUser.uid && (
            
              <button className="flex items-center text-white text-sm" onClick={sendFriendRequest} disabled={sending}>
              <UserPlus className="w-4 h-4 mr-1" /> {currentUserProfile?.friendRequests?.outgoing?.includes(post.createdBy)
  ? "Request Sent"
  : sending
  ? "Sending Req..."
  : "Add Friend"}

            </button>
            )}
          </div>
          <div className="mt-3" onClick={() => setIsOpen(true)}>
            <h3 className="font-bold text-white text-lg">{post.title}</h3>
            <p className="text-white mt-1">{post.content}</p>
            {post.category && post.category.length > 0 && (
              <div className="mt-2">
                {post.category.map((category, index) => (
                  <span key={index} className="bg-yellow-500 font-bold text-black px-2 py-1 rounded-md text-sm mr-2">
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex space-x-2 items-center">
              <button  className="p-1  hover:cursor-pointer" onClick={handleLikePost} disabled={isUpdating}>
                <ArrowUp className={`w-4 h-4 ${isUpvoted ? "text-yellow-400" : "text-white"} hover:text-yellow-400`} />
               
              </button>
              <span className="font-semibold text-white">{upvotes}</span>
              
              <button className="flex items-center text-white text-sm">
                <MessageCircle className="w-4 h-4 mr-1" />{post.answers?.length || 0} Answer
              </button>
            </div>
            <button className="flex items-center text-white text-sm">
              <Share className="w-4 h-4 mr-1" /> Share
            </button>
          </div>
        </div>

{/*<-================================================================================================->*/}

{isOpen&&
   (<div  className="fixed inset-0 flex items-center justify-center backdrop-blur-md backdrop-opacity-50 z-50">
   <div ref={modalRef} className="bg-gray-800 text-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
     
     
     <button onClick={()=>setIsOpen(!isOpen)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
       <X size={24} />
     </button>

    
     <h2 className="text-2xl font-bold mb-3">{post.title}</h2>

     
     <p className="text-gray-300">{post.content}</p>
     {post.category && post.category.length > 0 && (
              <div className="mt-2">
                {post.category.map((category, index) => (
                  <span key={index} className="bg-yellow-500 font-bold text-black px-2 py-1 rounded-md text-sm mr-2">
                    {category}
                  </span>
                ))}
              </div>
            )}

     
     <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
       <div>
         <span className="font-bold">{authorProfile.username}</span>
         <span className="ml-2 text-gray-500">• {timeAgo(post.createdAt)}</span>
       </div>
       <div className="flex space-x-4">
         <button className="flex items-center space-x-1 hover:cursor-pointer" onClick={handleLikePost} disabled={isUpdating}>
         <ArrowUp className={`w-4 h-4 ${isUpvoted ? "text-yellow-400" : "text-white"} hover:text-yellow-400`} /> <span>{upvotes}</span>
         </button>
         <button className="flex items-center space-x-1 hover:text-white">
           <MessageCircle size={16} /> <span>{livePost.answers?.length || 0} Answers</span>
         </button>
       </div>
     </div>

     {/* Answers Section */}
     <div className="mt-4 border-t border-gray-700 pt-4">
       <h3 className="text-lg font-semibold">Answers</h3>
       <div className="space-y-3">
<PostComment post={livePost}/>


         {livePost.answers && livePost.answers.length > 0 ? (
           livePost.answers.map((comment, index) => (
             

              <Comment comment={comment} index={index}/>
            
           ))
         ) : (
           <p className="text-gray-500">No answers yet.</p>
         )}
       </div>
     </div>

   </div>
 </div>)
}

    </>
  )
}

export default Post