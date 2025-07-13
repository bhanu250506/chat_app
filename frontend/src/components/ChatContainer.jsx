import React, { useEffect, useRef, useContext, useState } from 'react';
import assets from '../assets/assets';
import toast from 'react-hot-toast';
import { ChatContext } from '../../context/chatContext';
import { AuthContext } from '../../context/AuthContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import logo from '../assets/image.png'

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessage,
    isTyping,
    emitTyping,
    stopTyping,
  } = useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const scrollEnd = useRef();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage({ text: input.trim() });
    setInput('');
    stopTyping(); // ⛔️ Stop typing when message is sent
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) getMessage(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-gray-400 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-lg max-md:hidden">
        <img src= {logo} alt="" className="w-16 opacity-80 animate-fade-in" />
        <p className="text-xl text-white font-semibold">Chat Anytime, Anywhere</p>
      </div>
    );
  }

  return (
    <div className="h-full relative rounded-xl overflow-hidden bg-gradient-to-br from-[#0f172a]/90 to-[#1e293b]/90 backdrop-blur-xl text-white">
      {/* Header */}
      <div className="flex items-center gap-3 py-4 px-4 border-b border-white/10 backdrop-blur-md">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="flex-1 text-lg font-semibold flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden w-6 h-6 cursor-pointer"
        />
      </div>

      {/* Messages */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-4 pb-6">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            msg={msg}
            isMe={msg.senderId === authUser._id}
            profilePic={
              msg.senderId === authUser._id
                ? authUser?.profilePic
                : selectedUser?.profilePic
            }
          />
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}
        <div ref={scrollEnd} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-[#0f172a]/90 backdrop-blur-md border-t border-white/10">
        <div className="flex-1 flex items-center bg-white/10 px-3 rounded-full">
          <input
            onChange={(e) => {
              setInput(e.target.value);
              emitTyping(); // ✨ Typing trigger here
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(e);
            }}
            value={input}
            type="text"
            placeholder="Type your message..."
            className="flex-1 text-sm p-3 bg-transparent border-none outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="Upload"
              className="w-5 h-5 mr-2 cursor-pointer opacity-80 hover:opacity-100 transition"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="Send"
          className="w-7 h-7 cursor-pointer hover:scale-110 transition"
        />
      </div>
    </div>
  );
};

export default ChatContainer;
