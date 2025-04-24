import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase"; // Adjust the import based on your project structure
import AuthStore from "../../store/AuthStore";
import useGetUserById from "../../hooks/useGetUserById";

const FriendList = ({ onSelectFriend , selectedFriend }) => {
  const authUser = AuthStore((state) => state.user);
  const { userProfile, isLoading } = useGetUserById(authUser?.uid);
  const [friendProfiles, setFriendProfiles] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userProfile?.friends || userProfile.friends.length === 0) return;

      const profiles = await Promise.all(
        userProfile.friends.map(async (friendId) => {
          const friendRef = doc(firestore, "users", friendId);
          const friendSnap = await getDoc(friendRef);
          return friendSnap.exists() ? { id: friendId, ...friendSnap.data() } : null;
        })
      );

      setFriendProfiles(profiles.filter(Boolean));
    };

    fetchFriends();
  }, [userProfile]);

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Your Friends</h2>
      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : friendProfiles.length === 0 ? (
        <p className="text-gray-400">No friends found</p>
      ) : (
        friendProfiles.map((friend) => (
          <button
            key={friend.id}
            className=  {`w-full text-left px-3 py-2 rounded hover:bg-yellow-500 cursor-pointer font-bold mb-1 ${
              selectedFriend?.id === friend.id ? "bg-yellow-500" : "bg-gray-800"
}`}
            onClick={() => onSelectFriend(friend)}
          >
            {friend.username || friend.email}
          </button>
        ))
      )}
    </div>
  );
};

export default FriendList;
