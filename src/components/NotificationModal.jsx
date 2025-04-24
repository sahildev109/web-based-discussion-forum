import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import AuthStore from "../store/AuthStore";
import useGetUserById from "../hooks/useGetUserById";

const FriendRequestModal = ({ isOpen, onClose }) => {
  const authUser = AuthStore((state) => state.user); // only get uid
  const { userProfile, isLoading, setUserProfile } = useGetUserById(authUser?.uid);
  const [requestUsers, setRequestUsers] = useState([]);

  useEffect(() => {
    const fetchRequestUsers = async () => {
      if (!userProfile?.friendRequests?.incoming?.length) return;

      const usersData = await Promise.all(
        userProfile.friendRequests.incoming.map(async (uid) => {
          const ref = doc(firestore, "users", uid);
          const snap = await getDoc(ref);
          return snap.exists() ? { id: uid, ...snap.data() } : null;
        })
      );

      setRequestUsers(usersData.filter(Boolean));
    };

    fetchRequestUsers();
  }, [userProfile]);

  const handleAccept = async (requesterId) => {
    const userRef = doc(firestore, "users", authUser.uid);
    const requesterRef = doc(firestore, "users", requesterId);

    await updateDoc(userRef, {
      friends: arrayUnion(requesterId),
      "friendRequests.incoming": arrayRemove(requesterId),
    });

    await updateDoc(requesterRef, {
      friends: arrayUnion(authUser.uid),
      "friendRequests.outgoing": arrayRemove(authUser.uid),
    });

    // Re-fetch user profile
    setUserProfile({
      ...userProfile,
      friendRequests: {
        ...userProfile.friendRequests,
        incoming: userProfile.friendRequests.incoming.filter((id) => id !== requesterId),
      },
      friends: [...(userProfile.friends || []), requesterId],
    });

    // Remove from UI immediately
    setRequestUsers(prev => prev.filter(user => user.id !== requesterId));
  };

  const handleReject = async (requesterId) => {
    const userRef = doc(firestore, "users", authUser.uid);
    const requesterRef = doc(firestore, "users", requesterId);

    await updateDoc(userRef, {
      "friendRequests.incoming": arrayRemove(requesterId),
    });

    await updateDoc(requesterRef, {
      "friendRequests.outgoing": arrayRemove(authUser.uid),
    });

    // Re-fetch user profile
    setUserProfile({
      ...userProfile,
      friendRequests: {
        ...userProfile.friendRequests,
        incoming: userProfile.friendRequests.incoming.filter((id) => id !== requesterId),
      },
    });

    setRequestUsers(prev => prev.filter(user => user.id !== requesterId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center pt-20 backdrop-blur-md backdrop-opacity-50 z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Friend Requests</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {isLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : requestUsers.length === 0 ? (
          <p className="text-gray-400">No friend requests</p>
        ) : (
          requestUsers.map((u) => (
            <div key={u.id} className="flex justify-between items-center border-b border-gray-700 py-2">
              <span>{u.username || u.email}</span>
              <div className="flex space-x-2">
                <button
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                  onClick={() => handleAccept(u.id)}
                >
                  Accept
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  onClick={() => handleReject(u.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendRequestModal;
