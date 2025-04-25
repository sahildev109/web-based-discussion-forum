import React, { useEffect, useRef, useState,  useCallback  } from 'react';
import AuthStore from '../store/AuthStore';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import checkProfanity from '../Tools/moderation';
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
  const [image, setImage] = useState(null);
  const modalRef = useRef(null);
  const  authUser=AuthStore((state)=>state.user);





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

//===============================

const categorizePost = useCallback(async (title, content) => {
    const input = `Title: ${title}\nContent: ${content}\n\nCategorize the above text into the most relevant category from the following predefined list:\n${availableCategories.join(", ")}. Return only the category name.`;
  
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct:free",
          messages: [{ role: "user", content: input }],
        })
      });
  
      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || "";
      console.log("AI Response:", aiResponse);
  
      const parsedCategories = aiResponse.split(",")
        .map(cat => cat.trim())
        .filter(cat => availableCategories.includes(cat));
  
      console.log("Parsed Categories:", parsedCategories);
      setSelectedCategories(parsedCategories);
      return parsedCategories;
    } catch (error) {
      console.error("Error categorizing post:", error);
      setCategories(["General"]);
      return ["General"];
    }
  }, [availableCategories]);


//===============================


  const handleSubmit = async() => {

    if(!title){
      alert("Title is required");
      setLoading(false);return;
    }

    //===============================

    const combinedText = `${title} ${content}`;
    console.log('0.5 step')
    const hasProfanity = await checkProfanity(combinedText);
  console.log('0.75 step')
    if (hasProfanity) {
      alert("⚠️ Inappropriate content detected. Please revise your post.");
      setTitle("");
      setContent("");
      return;
    }
    //===============================

    let imageUrl = "";

    setLoading(true);
      // 1. Upload image if one is selected
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "react-uploads"); // change this
        formData.append("cloud_name", "dzsj989i0"); // change this
  
        const res = await axios.post("https://api.cloudinary.com/v1_1/dzsj989i0/image/upload", formData);
        imageUrl = res.data.secure_url;
      }

     


 
   const final =await categorizePost(title, content);

   const normalizedArray1 = final.map(item => ({
    value: item,
    label: item
  }));
  console.log(normalizedArray1)

const mergedCat=[...selectedCategories,...normalizedArray1]
console.log("selCat"+selectedCategories)
const validCategories = mergedCat.filter(cat => cat?.value);
// ✅ Remove duplicates by using a Set
const uniqueCategories = Array.from(new Set(validCategories.map(cat => cat.value)));
console.log(mergedCat)
// const uniqueCategories = Array.from(new Set(mergedCat.map(cat => cat.value)))
//  console.log("uCAT"+uniqueCategories)

const newPost={
   
    title: title,
    content: content,
    category:uniqueCategories, // Use the value of the selected category
    
  
    // category: finalCategories,
    upvotes: [],
    answers: [],
    createdAt: Date.now(),
	createdBy: authUser.uid,
  image: imageUrl
}
try {
   
    const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
    const userDocRef = doc(firestore, "users", authUser.uid);

await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });
await updateDoc(postDocRef, { postId: postDocRef.id })

setTitle(""); 
setContent("");
setImage(null);
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
  <div ref={modalRef} className="bg-gray-800 p-6 rounded-lg shadow-lg min-w-200 min-h-100 max-h-200 text-white flex flex-col">
   
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
    <input
  type="file"
  accept="image/*"
  onChange={(e) => setImage(e.target.files[0])}
  className="m-2 border-2 border-yellow-500 rounded-md p-2 bg-gray-700 text-white"
/>
{image && (
  <img
    src={URL.createObjectURL(image)}
    alt="Preview"
    className="mt-4 mb-4 w-64 h-40 object-cover rounded-md shadow-md border border-gray-600"
  />
)}




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
