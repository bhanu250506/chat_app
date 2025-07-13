import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import RightSlidebar from '../components/RightSlidebar';
import { ChatContext } from '../../context/chatContext';
import CustomBackground from './customBackground';

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);

  return (
    <div className="relative w-full h-screen sm:px-[10%] sm:py-[4%] overflow-hidden">
      {/* Background */}
      <CustomBackground />

      <div
        className={`backdrop-blur-2xl bg-white/5 border border-white/10 shadow-xl rounded-2xl h-full w-full overflow-hidden grid transition-all duration-300 
        ${selectedUser 
          ? 'md:grid-cols-[1fr_1.7fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' 
          : 'md:grid-cols-2'}`}
      >
        <Sidebar />
        <ChatContainer />
        <RightSlidebar />
      </div>
    </div>
  );
};

export default HomePage;
