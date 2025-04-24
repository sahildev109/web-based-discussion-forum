import React, { useState } from "react";
import AuthStore from "./store/AuthStore";
import { timeAgo } from "./utils/timeAgo";
import useGetUserPosts from "./hooks/useGetUserPosts";
import Post from "./components/Post";
import useGetUserById from "./hooks/useGetUserById";

const ProfilePage = () => {
const {user}=AuthStore();
const {  userProfile, isLoading: loadingAuthor } = useGetUserById(user?.uid);

    const  { posts, isLoading }=useGetUserPosts(user.uid)
    const [location, setLocation] = useState("MUMBAI");
    
    const [avatar, setAvatar] = useState("https://icons.veryicon.com/png/o/miscellaneous/common-icons-31/default-avatar-2.png");


   


  return (
<>
<div className="h-screen w-screen bg-gray-900 overflow-scroll">
<div className="max-w-5xl mx-auto p-6 bg-gray-900 shadow-lg mt-10 border-2 border-yellow-400">
            
            <div className="flex items-center mb-8">
                
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400">
                    <img src={avatar} alt="User Avatar" id="avatar" className="w-full h-full object-cover" />
                </div>

               
             {loadingAuthor? <p className="text-white">Loading ....</p>:(
                   <div className="ml-6">
                   <h1 className="text-3xl font-semibold text-yellow-500">{ userProfile.username}</h1>
                   <p className="text-white mt-2">{ userProfile.fullName}</p>
                   <p className="text-white mt-2"> { userProfile.friends.length} Friends</p>
                   <p className="mt-2 text-white"><strong>Location:</strong> {location}</p>
                   <p className="mt-2 text-white"><strong>Join Date:</strong> {timeAgo( userProfile.createdAt)}</p>
                   <button
                       className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-full text-sm hover:bg-yellow-400"
                      
                   >
                       Edit Info
                   </button>
               </div>
             )}
            </div>

         

           

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-white">Recent Posts</h3>
                {isLoading? <p className="text-white">Loading ....</p>:null}
                {!isLoading && posts.length !== 0 &&posts.map((post) => <Post key={post.id} post={post} />)}
                {!isLoading &&posts.length===0 && <p className="text-white">No post yet!</p>}

               
            </div>

        </div>
        </div>
</>
  )
}

export default ProfilePage