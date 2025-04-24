import React, { useState, useEffect, use } from "react";
import {
  Home, Bell, MessageSquare, User, Settings,
  Edit, Vote, ThumbsUp, ThumbsDown, Smile, Bookmark, TrendingUp,
  Code
} from "lucide-react";
import axios from "axios";
import useLogout from "./hooks/useLogout";
import AuthStore from "./store/AuthStore";
import { Navigate, useNavigate } from "react-router-dom";
import PostCreation from "./components/PostCreation";

import Posts from "./components/Posts";
import NotificationModal from "./components/NotificationModal";
import useGetUserById from "./hooks/useGetUserById";
import logo from "./assets/digital_tech_book_logo_design_template-removebg-preview.png";
const categories = [ "Explore","General", "Announcements", "Feedback & Suggestions", 
  "Programming & Development", "Web Development", "Mobile App Development", 
  "AI & Machine Learning", "Cybersecurity", "Cloud Computing & DevOps", 
  "Computer Science Concepts", "DSA & Competitive Programming", "Academic Resources", 
  "Career & Job Advice", "Project Showcase", "Open Source Contributions", 
  "Hackathons & Competitions", "Gaming & Esports", "Movies & TV Shows", 
  "Music & Instruments", "Tech News & Innovations", "Gadgets & Devices", 
  "Software & Tools", "Self-Improvement", "Finance & Investments", "Fitness & Health"];

const Forum = () => {
  const {user}=AuthStore();
  const {userProfile}=useGetUserById(user?.uid);
  const navigate=useNavigate();


  
  const [selectedCategory, setSelectedCategory] = useState("Explore");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenN, setIsOpenN] = useState(false);
  const { handleLogout, isLoggingOut, error } = useLogout();



  return (
    <>
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans overflow-scroll">
      <div className="fixed top-0 left-0 right-0 bg-gray-800 bg-opacity-90 shadow-md p-4 flex justify-between items-center z-20">
        <div className="flex items-center space-x-3">
       
          {/* <h1 className="text-2xl font-bold text-white font-mono"> &lt;/&gt; NEXUS</h1> */}
          <img src={logo} alt="hello" className="h-15 w-24 p-0 ml-10 " />
        </div>
        <div className="flex items-center space-x-4">
         {userProfile?.friendRequests.incoming.length===0? null:userProfile?.friendRequests.incoming.length} <Bell className="w-6 h-6 cursor-pointer hover:text-yellow-400 transition-colors" title="Notifications"  onClick={()=>{setIsOpenN(true)}}/>
          <MessageSquare className="w-6 h-6 cursor-pointer hover:text-yellow-400 transition-colors" title="Messages" onClick={()=>navigate("/chat")} />
          <User className="w-6 h-6 cursor-pointer hover:text-yellow-400 transition-colors" title="Profile"
          onClick={()=>navigate("/pp")}
           />
          <Settings className="w-6 h-6 cursor-pointer hover:text-yellow-400 transition-colors" title="Settings"  onClick={() => setIsOpen(!isOpen)}/>
        </div>
      </div>
      <div className="flex flex-grow pt-20">
        <div className="w-64 bg-gray-800 bg-opacity-90 p-4 border-r border-gray-700">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="space-y-2 mt-4">
            {categories
              .filter((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((category) => (
                <button
                  key={category}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === category ? "bg-yellow-500 text-black" : "bg-gray-700 hover:bg-yellow-500 hover:text-black"}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
          </div>
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <div className="mb-6 p-4 bg-gray-800 rounded-md shadow-lg">


          <PostCreation />
          </div>

          
          <Posts selectedCategory={selectedCategory}/>
          <div className="space-y-4">
            
          </div>
        </div>
      </div>
    </div>
<NotificationModal isOpen={isOpenN} onClose={() => setIsOpenN(false)} />

    {isOpen && (
        <div className="fixed inset-0 flex items-start justify-end pt-18 backdrop-blur-md backdrop-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
           <div>

            <button className="px-4 py-2 font-bold bg-gray-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition-all " onClick={handleLogout} lo>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>

            <p>{user.username}</p>
           </div>
            <div className="mt-4 flex justify-end">
              
            </div>
          </div>
        </div>
      )}

    </>
  );



};

export default Forum;
