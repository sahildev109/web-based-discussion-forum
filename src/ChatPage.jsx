import React, { useState } from 'react'
import FriendList from './components/Chat/FriendList'
import ChatWindow  from './components/Chat/ChatWindow'

export const ChatPage = () => {
    const [selectedFriend, setSelectedFriend] = useState(null);
  return (
  <>
  <div className='flex bg-gray-900 h-screen w-screen text-white'>
  <FriendList onSelectFriend={setSelectedFriend} selectedFriend={selectedFriend}/>
<ChatWindow selectedFriend={selectedFriend} />
</div>
  </>
  )
}
