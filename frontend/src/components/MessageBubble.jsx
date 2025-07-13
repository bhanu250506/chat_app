import React from 'react';
import { formatMessageTime } from '../lib/utils';
import assets from '../assets/assets';

const MessageBubble = ({ msg, isMe, profilePic }) => {
  return (
    <div className={`flex items-end gap-3 mb-5 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {msg.image ? (
        <img
          src={msg.image}
          alt="sent"
          className="max-w-[230px] border border-gray-600 rounded-xl shadow-md"
        />
      ) : (
        <p
          className={`p-3 max-w-[230px] text-sm leading-relaxed font-normal break-words backdrop-blur-sm ${
            isMe
              ? 'bg-gradient-to-tr from-purple-600/40 to-violet-500/30 rounded-br-none'
              : 'bg-gradient-to-tr from-blue-500/40 to-indigo-500/30 rounded-bl-none'
          } rounded-xl`}
        >
          {msg.text}
        </p>
      )}
      <div className="text-center text-xs min-w-[50px]">
        <img
          src={profilePic || assets.avatar_icon}
          alt=""
          className="w-7 h-7 rounded-full object-cover border border-gray-500"
        />
        <p className="text-gray-400 mt-1">{formatMessageTime(msg.createdAt)}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
