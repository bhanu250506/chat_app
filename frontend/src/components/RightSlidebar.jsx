import React, { useContext, useState, useEffect } from 'react';
import assets from '../assets/assets';
import { ChatContext } from '../../context/chatContext';
import { AuthContext } from '../../context/AuthContext';

const RightSlidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/80 backdrop-blur-xl rounded-l-xl text-white max-md:hidden overflow-hidden border-l border-white/10 shadow-inner">
      <div className="flex flex-col h-full justify-between p-6 overflow-y-auto">

        {/* Top content */}
        <div>
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center gap-2">
            <img
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border border-white/20 shadow-lg"
            />
            <div className="flex items-center gap-2 text-lg font-semibold mt-2">
              {onlineUsers.includes(selectedUser._id) && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              )}
              {selectedUser.fullName}
            </div>
            <p className="text-sm text-gray-300">{selectedUser.bio}</p>
          </div>

          <hr className="border-white/10 my-6" />

          {/* Media Gallery */}
          <div>
            <h3 className="text-sm text-white/80 font-medium mb-3">Shared Media</h3>
            <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
              {msgImages.length > 0 ? (
                msgImages.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => window.open(url, '_blank')}
                    className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={url}
                      alt={`media-${idx}`}
                      className="rounded-lg shadow-md h-24 w-full object-cover border border-white/10"
                    />
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-xs text-center text-gray-400">No media shared yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-6">
          <button
            onClick={logout}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-violet-700 rounded-full shadow-md hover:brightness-110 transition duration-200 text-sm font-semibold"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default RightSlidebar;
