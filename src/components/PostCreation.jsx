import React, { useEffect, useRef, useState } from 'react';
import AuthStore from '../store/AuthStore';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';

const PostCreation = () => {

  const [availableCategories, setAvailableCategories] = useState([
    "General", "Announcements", "Feedback & Suggestions", 
    "Programming & Development", "Web Development", "Mobile App Development", 
    "AI & Machine Learning", "Cybersecurity", "Cloud Computing & DevOps", 
    "Computer Science Concepts", "DSA & Competitive Programming", "Academic Resources", 
    "Career & Job Advice", "Project Showcase", "Open Source Contributions", 
    "Hackathons & Competitions", "Gaming & Esports", "Movies & TV Shows", 
    "Music & Instruments", "Tech News & Innovations", "Gadgets & Devices", 
    "Software & Tools", "Self-Improvement", "Finance & Investments", "Fitness & Health"
  ]);
  
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categoryOptions = availableCategories.map(cat => ({
    value: cat,
    label: cat
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title , setTitle] = useState("");
  const [content, setContent] = useState("");
  const modalRef = useRef(null);
  const  authUser=AuthStore((state)=>state.user);

//--------------

const checkProfanity = async (text) => {
  try {
    const response = await fetch('http://localhost:5000/api/checkProfanity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    return data.hasProfanity;
  } catch (error) {
    console.error("Error checking profanity:", error);
    return false;
  }
};


//--------------




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

  const handleSubmit = async() => {

    if(!title){
      alert("Title is required");
      setLoading(false);return;
    }

    //===============================

    const combinedText = `${title} ${content}`;
    const hasProfanity = await checkProfanity(combinedText);
  
    if (hasProfanity) {
      alert("⚠️ Inappropriate content detected. Please revise your post.");
      return;
    }
    //===============================



const newPost={
   
    title: title,
    content: content,
    category: selectedCategories.map(cat => cat.value),
    upvotes: [],
    answers: [],
    createdAt: Date.now(),
	createdBy: authUser.uid,
}
try {
    setLoading(true);
    const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
    const userDocRef = doc(firestore, "users", authUser.uid);

await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });
await updateDoc(postDocRef, { postId: postDocRef.id })

setTitle(""); 
setContent("");
setIsOpen(false);
} catch (error) {
    console.error("Error adding post:", error);
}
finally{
    setLoading(false);
}

  }

  return (
    <>
      <input
        type="text"
        placeholder="What's on your mind?"
        className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        onClick={() => setIsOpen(true)}
      />
      <div className="flex justify-between mt-3">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md transition-all"
        >
          Post
        </button>
      </div>



      {isOpen && (
      <div className="fixed inset-0 flex items-center justify-center pt-18 backdrop-blur-md backdrop-opacity-50">
  <div ref={modalRef} className="bg-gray-800 p-6 rounded-lg shadow-lg w-200 h-100 text-white flex flex-col">
   
    <h2 className="text-xl font-bold mb-4">Create a Post</h2>
    <input
      type="text"
      placeholder="Title of Your Post...."
      className="text-xl w-full border-none focus:outline-none p-2 rounded-md"
      value={title}
      onChange={(e) => setTitle(e.target.value)} />
    <textarea
      name="post"
      id="post"
      className="w-full mt-4 focus:outline-none h-50  p-2 rounded-md"
      placeholder="Share Your Thoughts ...."
      value={content}
      onChange={(e) => setContent(e.target.value)}
    ></textarea>

<CreatableSelect
    
    isMulti
    options={categoryOptions}
    value={selectedCategories}
    onChange={(newValue) => setSelectedCategories(newValue)}
    placeholder="Select or add categories..."
    className="text-black"
  />

    <div className="mt-6 flex item-end justify-end">
      <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md transition-all" onClick={handleSubmit} >
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  </div>
</div>

      )}
    </>
  );
};

export default PostCreation;
