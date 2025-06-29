import React, { useState } from "react";
import { Fundasi_backend } from "../../../../../declarations/Fundasi_backend";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";

const EditProfile: React.FC = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await Fundasi_backend.updateUserProfile(
        username,
        avatarPreview ? [avatarPreview] : []
      );
      if ("ok" in result) {
        await refreshUser();
        navigate("/user-profile");
      } else {
        setError(result.err);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a1a] p-8 rounded-xl shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center">Edit Profile</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="space-y-2">
            <label htmlFor="avatarUrl" className="block text-sm">
              Avatar Image (optional)
            </label>
            <input
              id="avatarUrl"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-24 h-24 object-cover rounded-full mt-2"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-green-500 text-black font-semibold rounded hover:bg-green-400 transition"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
