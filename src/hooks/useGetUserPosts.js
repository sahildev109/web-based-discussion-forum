import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebase"; 

const useGetUserPosts = (userId) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return; 

    const fetchUserPosts = async () => {
      setIsLoading(true);
      try {
        const postsRef = collection(firestore, "posts");
        const q = query(postsRef, where("createdBy", "==", userId));
        const querySnapshot = await getDocs(q);

        const userPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  return { posts, isLoading };
};

export default useGetUserPosts;
