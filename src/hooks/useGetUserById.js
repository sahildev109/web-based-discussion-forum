import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetUserById = (userId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    const userRef = doc(firestore, "users", userId);

    // 🔄 Listen for real-time changes
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setUserProfile(snapshot.data());
        } else {
          setUserProfile(null);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching real-time user profile:", error);
        setIsLoading(false);
      }
    );

    // Cleanup listener on unmount or userId change
    return () => unsubscribe();
  }, [userId]);

  return { userProfile, isLoading, setUserProfile };
};

export default useGetUserById;
