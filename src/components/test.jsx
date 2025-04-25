// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import AuthStore from '../store/AuthStore';
// import { addDoc, arrayUnion, collection, doc, writeBatch } from 'firebase/firestore';
// import { firestore } from '../firebase/firebase';
// import checkProfanity from '../Tools/moderation';
// import { parse } from 'postcss';

// const PostCreation = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [categories, setCategories] = useState([]);
//   const modalRef = useRef(null);
//   const authUser = AuthStore((state) => state.user);

//   const availableCategories = [
//     "General", "Announcements", "Feedback & Suggestions",
//     "Programming & Development", "Web Development", "Mobile App Development",
//     "AI & Machine Learning", "Cybersecurity", "Cloud Computing & DevOps",
//     "Computer Science Concepts", "DSA & Competitive Programming", "Academic Resources",
//     "Career & Job Advice", "Project Showcase", "Open Source Contributions",
//     "Hackathons & Competitions", "Gaming & Esports", "Movies & TV Shows",
//     "Music & Instruments", "Tech News & Innovations", "Gadgets & Devices",
//     "Software & Tools", "Self-Improvement", "Finance & Investments", "Fitness & Health"
//   ];

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen]);

//   const categorizePost = useCallback(async (title, content) => {
//     const input = Title: ${title}\nContent: ${content}\n\nCategorize the above text into the most relevant category from the following predefined list:\n${availableCategories.join(", ")}. Return only the category name.;
  
//     try {
//       const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Authorization": "Bearer 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",
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           model: "mistralai/mistral-7b-instruct:free",
//           messages: [{ role: "user", content: input }],
//         })
//       });
  
//       const data = await response.json();
//       const aiResponse = data.choices?.[0]?.message?.content || "";
//       console.log("AI Response:", aiResponse);
  
//       const parsedCategories = aiResponse.split(",")
//         .map(cat => cat.trim())
//         .filter(cat => availableCategories.includes(cat));
  
//       console.log("Parsed Categories:", parsedCategories);
//       setCategories(parsedCategories);
//       return parsedCategories;
//     } catch (error) {
//       console.error("Error categorizing post:", error);
//       setCategories(["General"]);
//       return ["General"];
//     }
//   }, [availableCategories]);
  
// const handleSubmit = useCallback(async () => {
//   if (!title.trim()) {
//     alert("Title is required");
//     return;
//   }

//   const combinedText = `${title} ${content}`;
//   const hasProfanity = await checkProfanity(combinedText);
//   if (hasProfanity) {
//     alert("⚠ Inappropriate content detected. Please revise your post.");
//     setTitle("");
//     setContent("");
//     return;
//   }

//   setLoading(true);

//   let finalCategories = categories;


//   if (categories.length === 0) {
//     finalCategories = await categorizePost(title, content);
//   }

//   console.log("Final Categories:", finalCategories);

//   const newPost = {
//     title,
//     content,
//     category: finalCategories,
//     upvotes: [],
//     answers: [],
//     createdAt: Date.now(),
//     createdBy: authUser.uid,
//   };

//   try {
//     const batch = writeBatch(firestore);
//     const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
//     const userDocRef = doc(firestore, "users", authUser.uid);

//     batch.update(userDocRef, { posts: arrayUnion(postDocRef.id) });
//     batch.update(postDocRef, { postId: postDocRef.id });

//     await batch.commit();

//     setTitle("");
//     setContent("");
//     setIsOpen(false);
//     setCategories([]); 
//   } catch (error) {
//     console.error("Error adding post:", error);
//   } finally {
//     setLoading(false);
//   }
// }, [title, content, authUser.uid, categories, categorizePost]);


//   return (
//     <>
//       <input
//         type="text"
//         placeholder="What's on your mind?"
//         className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//         onClick={() => setIsOpen(true)}
//       />
//       <div className="flex justify-between mt-3">
//         <button
//           className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md transition-all"
//           onClick={() => setIsOpen(true)}
//         >
//           Post
//         </button>
//       </div>

//       {isOpen && (
//         <div className="fixed inset-0 flex items-center justify-center pt-18 backdrop-blur-md backdrop-opacity-50">
//           <div ref={modalRef} className="bg-gray-800 p-6 rounded-lg shadow-lg w-200 h-100 text-white flex flex-col">
//             <h2 className="text-xl font-bold mb-4">Create a Post</h2>
//             <input
//               type="text"
//               placeholder="Title of Your Post...."
//               className="text-xl w-full border-none focus:outline-none p-2 rounded-md"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//             <textarea
//               className="w-full mt-4 focus:outline-none h-50 p-2 rounded-md"
//               placeholder="Share Your Thoughts ...."
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//             ></textarea>

//             <div className="mt-6 flex item-end justify-end">
//               <button
//                 className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-md transition-all"
//                 onClick={handleSubmit}
//                 disabled={loading}
//               >
//                 {loading ? "Posting..." : "Post"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default PostCreation;