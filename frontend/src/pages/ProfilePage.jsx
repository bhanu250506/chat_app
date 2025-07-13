import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authUser?.fullName || '');
  const [bio, setBio] = useState(authUser?.bio || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!selectedImg) {
        await updateProfile({ fullName: name, bio });
        navigate('/');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      reader.onload = async () => {
        const base64Image = reader.result;
        await updateProfile({ profilePic: base64Image, fullName: name, bio });
        navigate('/');
      };
    } catch (error) {
      console.error('Update failed:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl font-medium">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-10 bg-gradient-to-br from-[#1e1e2f] to-[#2a2a4d] flex items-center justify-center">
      <div className="w-full max-w-4xl bg-[#1f1b3a]/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10 grid md:grid-cols-2 gap-8 text-white">

        {/* Left - Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">Edit Profile</h2>

          {/* Profile Upload */}
          <div className="flex items-center gap-4">
            <label htmlFor="avatar" className="cursor-pointer flex items-center gap-3 group">
              <img
                src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon}
                alt="Avatar"
                className="w-14 h-14 object-cover rounded-full border border-white/20 group-hover:scale-105 transition"
              />
              <span className="text-sm text-white/70 group-hover:text-white">Upload New Picture</span>
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              hidden
              onChange={(e) => {
                if (e.target.files[0]) setSelectedImg(e.target.files[0]);
              }}
            />
          </div>

          {/* Full Name */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="bg-[#2e2a4d] px-4 py-3 rounded-md border border-white/20 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* Bio */}
          <textarea
            rows="4"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us something about yourself..."
            required
            className="bg-[#2e2a4d] px-4 py-3 rounded-md border border-white/20 placeholder-white/60 text-white resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* Save */}
          <button
            type="submit"
            className="bg-gradient-to-r from-violet-600 to-purple-500 hover:opacity-90 rounded-md py-3 font-semibold transition-all shadow-md"
          >
            Save Changes
          </button>
        </form>

        {/* Right - Preview Card */}
        <div className="flex flex-col justify-center items-center text-center gap-4">
          <img
            src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-full border-4 border-white/10 shadow-md"
          />
          <h3 className="text-lg font-semibold">{name || 'Your Name'}</h3>
          <p className="text-sm text-white/70">{bio || 'Your bio will show here.'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
