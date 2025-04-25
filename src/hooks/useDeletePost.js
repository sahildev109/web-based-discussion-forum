import { deleteDoc, doc, updateDoc, arrayRemove } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import AuthStore from "../store/AuthStore";

const useDeletePost = () => {
  const authUser = AuthStore((state) => state.user);

  const deletePost = async (postId) => {
    try {
      if (!authUser || !authUser.uid) {
        throw new Error("User not authenticated");
      }

      // 1. Delete post document from "posts" collection
      await deleteDoc(doc(firestore, "posts", postId));

      // 2. Remove post ID from the user's document
      const userDocRef = doc(firestore, "users", authUser.uid);
      await updateDoc(userDocRef, {
        posts: arrayRemove(postId),
      });

      console.log("✅ Post deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting post:", error.message);
      throw error;
    }
  };

  return deletePost;
};

export default useDeletePost;
