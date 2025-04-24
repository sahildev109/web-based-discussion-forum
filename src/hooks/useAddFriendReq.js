import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import AuthStore from "../store/AuthStore";


const useAddFriendReq = ({senderId, receiverId}) => {

    const [sending, setSending] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const updateOutgoing = AuthStore((state) => state.updateOutgoing);

    useEffect(() => {
      const checkFriendStatus = async () => {
        if (!senderId || !receiverId || senderId === receiverId) return;
  
        try {
          const senderRef = doc(firestore, "users", senderId);
          const senderSnap = await getDoc(senderRef);
  
          if (senderSnap.exists()) {
            const senderData = senderSnap.data();
            if (senderData.friends?.includes(receiverId)) {
              setIsFriend(true);
            } else {
              setIsFriend(false);
            }
          }
         
        } catch (error) {
          console.error("Error checking friendship status:", error);
        }
      };
  
      checkFriendStatus();
    }, [senderId, receiverId]);

    const sendFriendRequest = async () => {
       try {
        setSending(true);
        const senderRef = doc(firestore, "users", senderId);
        const receiverRef = doc(firestore, "users", receiverId);
      
        // Add receiver ID to sender's "outgoing"
        await updateDoc(senderRef, {
          "friendRequests.outgoing": arrayUnion(receiverId),
        });
      
        // Add sender ID to receiver's "incoming"
        await updateDoc(receiverRef, {
          "friendRequests.incoming": arrayUnion(senderId),
        });



       } catch (error) {
         console.error("Error sending friend request:", error);
         setSending(false);
        
       }finally {
        setSending(false);
       }            
      };
return { sendFriendRequest, sending, isFriend };      
}

export default useAddFriendReq