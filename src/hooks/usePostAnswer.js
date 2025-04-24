import { useState } from "react";
import AuthStore from "../store/AuthStore";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import checkProfanity from "../Tools/moderation";

const usePostAnswer = () => {
	const [isAnswering, setIsAnswering] = useState(false);
	
	const authUser = AuthStore((state) => state.user);
	
	const handlePostAnswer = async (postId, answer) => {
		if (isAnswering) return;
		const hasProfanity = await checkProfanity(answer);
  
		if (hasProfanity) {
		  alert("⚠️ Inappropriate content detected. Please revise your answer.");
		 
		  return;
		}
		
		setIsAnswering(true);
		const newAnswer = {
			answer,
            upvotes: [],
			createdAt: Date.now(),
			createdBy: authUser.uid,
			postId,
		};
		try {
			await updateDoc(doc(firestore, "posts", postId), {
				answers: arrayUnion(newAnswer),
			});
			
		} catch (error) {
			console.error("Error posting answer:", error);
		} finally {
			setIsAnswering(false);
		}
	};

	return { isAnswering, handlePostAnswer };
};

export default usePostAnswer;
