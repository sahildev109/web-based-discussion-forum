// import React, { useEffect, useState } from "react";
// import { collection, getDocs, query, orderBy, limit, getDoc, doc } from "firebase/firestore";
// import { firestore } from "../firebase/firebase";

// const useGetPost = () => {
//   const [posts, setPosts] = useState([]);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
   
//         const postsQuery = query(collection(firestore, "posts"), orderBy("createdAt", "desc"), limit(10));
//         const postDocs = await getDocs(postsQuery);

        
//         const fetchedPosts = [];
// postDocs.forEach((doc) => {
//           fetchedPosts.push({ id: doc.id, ...doc.data() });
//         });

//         setPosts(fetchedPosts);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//       }
//     };

//     fetchPosts();
//   }, []);
// return {posts};
// }

// export default useGetPost;

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where, limit } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetPost = (selectedCategory) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log("Selected Category:", selectedCategory); // Debugging line
    const fetchPosts = async () => {
      try {
        let postsQuery;

        if (selectedCategory !== "Explore") {
          // Fetch posts that contain the selected category
          postsQuery = query(
            collection(firestore, "posts"),
            where("category", "array-contains", selectedCategory),
            orderBy("createdAt", "desc"),
            limit(10)
          );
        } else {
          // Fetch all posts if "Explore" is selected
          postsQuery = query(
            collection(firestore, "posts"),
            orderBy("createdAt", "desc"),
            limit(10)
          );
        }

        const postDocs = await getDocs(postsQuery);
        const fetchedPosts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [selectedCategory]); // Refetch posts when selectedCategory changes

  return { posts };
};

export default useGetPost;

