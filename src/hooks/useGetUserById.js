import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useGetUserById = (userId) => {
	const [isLoading, setIsLoading] = useState(true);
	const [userProfile, setUserProfile] = useState(null);



	useEffect(() => {
		const getUserProfile = async () => {
			setIsLoading(true);
			setUserProfile(null);
			try {
				const userRef = await getDoc(doc(firestore, "users", userId));
				if (userRef.exists()) {
					setUserProfile(userRef.data());
				}
			} catch (error) {
			console.log("Error fetching user profile:", error);
			} finally {
				setIsLoading(false);
			}
		};
		getUserProfile();
	}, [userId]);

	return {  userProfile,isLoading, setUserProfile };
};

export default useGetUserById;