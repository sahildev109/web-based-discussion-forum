import { useState } from "react";
import { ArrowUp, ArrowDown, MessageCircle, Share, UserPlus } from "lucide-react";

const posts = [
  {
    id: 1,
    user: "John Doe",
    avatar: "https://via.placeholder.com/50",
    timestamp: "2 hours ago",
    title: "How to Learn React?",
    content: "React is a powerful JavaScript library for building user interfaces...",
    votes: 10,
  },
  {
    id: 2,
    user: "Jane Smith",
    avatar: "https://via.placeholder.com/50",
    timestamp: "5 hours ago",
    title: "Understanding Hooks",
    content: "Hooks let you use state and other React features without writing a class...",
    votes: 8,
  },
];

export default function PostList() {
  const [voteCounts, setVoteCounts] = useState(
    posts.reduce((acc, post) => {
      acc[post.id] = post.votes;
      return acc;
    }, {})
  );

  const handleVote = (id, type) => {
    setVoteCounts((prev) => ({
      ...prev,
      [id]: type === "upvote" ? prev[id] + 1 : prev[id] - 1,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="p-4 bg-white shadow-md rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={post.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
              <div>
                <h4 className="font-semibold">{post.user}</h4>
                <p className="text-sm text-gray-500">{post.timestamp}</p>
              </div>
            </div>
            <button className="flex items-center text-gray-500 text-sm">
              <UserPlus className="w-4 h-4 mr-1" /> Add Friend
            </button>
          </div>
          <div className="mt-3">
            <h3 className="font-bold text-lg">{post.title}</h3>
            <p className="text-gray-700 mt-1">{post.content}</p>
          </div>
          <div className="flex justify-between mt-3">
            <div className="flex space-x-2 items-center">
              <button onClick={() => handleVote(post.id, "upvote")} className="p-1 text-gray-500 hover:text-black">
                <ArrowUp className="w-4 h-4" />
              </button>
              <span className="font-semibold">{voteCounts[post.id]}</span>
              <button onClick={() => handleVote(post.id, "downvote")} className="p-1 text-gray-500 hover:text-black">
                <ArrowDown className="w-4 h-4" />
              </button>
              <button className="flex items-center text-gray-500 text-sm">
                <MessageCircle className="w-4 h-4 mr-1" /> Comment
              </button>
            </div>
            <button className="flex items-center text-gray-500 text-sm">
              <Share className="w-4 h-4 mr-1" /> Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
