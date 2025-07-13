import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import logo from '../assets/image.png';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/chatContext';

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`bg-gradient-to-br from-[#0f172a]/80 to-[#1e293b]/80 backdrop-blur-lg h-full p-6 rounded-r-xl overflow-y-auto text-white w-full max-w-sm transition-all ${
        selectedUser ? 'max-md:hidden' : ''
      }`}
    >
      {/* Header */}
      <div className="pb-6">
        <div className="flex justify-between items-center">
          <img src={logo} alt="logo" className="w-8" />
          <div className="relative" ref={dropdownRef}>
            <img
              src={assets.menu_icon}
              alt="Menu"
              className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100 transition"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            />
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 z-20 w-40 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-md shadow-md text-sm animate-fade-in">
                <p
                  onClick={() => {
                    navigate('/profile');
                    setDropdownOpen(false);
                  }}
                  className="cursor-pointer hover:underline text-white"
                >
                  Edit Profile
                </p>
                <hr className="my-2 border-white/20" />
                <p
                  onClick={logout}
                  className="cursor-pointer hover:underline text-red-300"
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="bg-white/10 flex items-center gap-3 px-3 py-2 rounded-full backdrop-blur-md">
          <img
            src={assets.search_icon}
            alt="Search"
            className="w-4 h-4 opacity-70"
          />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search users..."
            className="bg-transparent outline-none text-white placeholder-gray-300 flex-1 text-sm"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex flex-col gap-3">
        {filteredUsers.map((user, index) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);
          return (
            <div
              key={index}
              onClick={() => {
                setSelectedUser(user);
                setUnseenMessages((prev) => ({
                  ...prev,
                  [user._id]: 0,
                }));
              }}
              className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-r from-violet-500/40 to-indigo-700/40 shadow-md'
                  : 'hover:bg-white/10'
              }`}
            >
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border border-white/10"
              />
              <div className="flex flex-col leading-snug">
                <p className="font-medium text-white">{user.fullName}</p>
                <span
                  className={`text-xs ${
                    isOnline ? 'text-green-400' : 'text-gray-400'
                  }`}
                >
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              {unseenMessages[user._id] > 0 && (
                <span className="absolute top-2 right-3 text-xs h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white font-bold shadow-sm">
                  {unseenMessages[user._id]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
