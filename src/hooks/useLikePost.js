import { useState } from "react";
import AuthStore from "../store/AuthStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useLikePost = (post) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const authUser = AuthStore((state) => state.user);
	const [upvotes, setUpvotes] = useState(post.upvotes.length);
	const [isUpvoted, setIsUpvoted] = useState(post.upvotes.includes(authUser?.uid));
	

	const handleLikePost = async () => {
		if (isUpdating) return;
		
		try {
			const postRef = doc(firestore, "posts", post.id);
			await updateDoc(postRef, {
				upvotes: isUpvoted ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
			});

			setIsUpvoted(!isUpvoted);
			isUpvoted ? setUpvotes(upvotes - 1) : setUpvotes(upvotes + 1);
		} catch (error) {
			console.log(error)
		} finally {
			setIsUpdating(false);
		}
	};

	return { isUpvoted, upvotes, handleLikePost, isUpdating };
};

export default useLikePost;