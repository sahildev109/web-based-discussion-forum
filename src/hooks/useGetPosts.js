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
import { collection, query, orderBy, where, limit, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetPost = (selectedCategory) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Selected Category:", selectedCategory);
    setIsLoading(true);

    let postsQuery;

    if (selectedCategory !== "Explore") {
      postsQuery = query(
        collection(firestore, "posts"),
        where("category", "array-contains", selectedCategory),
        orderBy("createdAt", "desc"),
        limit(10)
      );
    } else {
      postsQuery = query(
        collection(firestore, "posts"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
    }

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setIsLoading(false);
    });

    return () => unsubscribe(); // Clean up listener on unmount or category change
  }, [selectedCategory]);

  return { posts, isLoading };
};

export default useGetPost;
