import { createContext, useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  const { socket, axios, authUser } = useContext(AuthContext);
  const typingTimeout = useRef(null);

  // Get users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error while fetching users");
    }
  };

  // Get messages
  const getMessage = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      } else {
        toast.error(data.message || "Failed to fetch messages");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error while fetching messages");
    }
  };

  // Send message
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
        stopTyping(); // stop typing on send
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  };

  // Incoming socket message
  const handleNewMessage = (newMessage) => {
    if (selectedUser && newMessage.senderId === selectedUser._id) {
      newMessage.seen = true;
      setMessages((prev) => [...prev, newMessage]);
      axios.put(`/api/messages/mark/${newMessage._id}`);
    } else {
      setUnseenMessages((prev) => ({
        ...prev,
        [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
      }));
    }
  };

  // --- Typing Handlers ---

  const handleTyping = () => {
    setIsTyping(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const emitTyping = () => {
    if (socket && selectedUser) {
      socket.emit("typing", { to: selectedUser._id });
    }
  };

  const stopTyping = () => {
    if (socket && selectedUser) {
      socket.emit("stopTyping", { to: selectedUser._id });
    }
  };

  // Subscribe to events
  const subscribeToSocket = () => {
    if (!socket) return;

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", () => setIsTyping(false));
  };

  const unsubscribeFromSocket = () => {
    if (!socket) return;

    socket.off("newMessage", handleNewMessage);
    socket.off("typing", handleTyping);
    socket.off("stopTyping");
  };

  useEffect(() => {
    subscribeToSocket();
    return () => unsubscribeFromSocket();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    getUsers,
    getMessage,
    sendMessage,
    setMessages,
    unseenMessages,
    setUnseenMessages,
    isTyping,
    emitTyping,
    stopTyping,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
