"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BlogProfile {
  _id: string;
  profileName: string;
  siteUrl: string;
  username: string;
  appPassword: string;
  blogName: string;
  blogDescription?: string;
  isDefault: boolean;
}

export default function BlogProfilesPage() {
  const [profiles, setProfiles] = useState<BlogProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<BlogProfile | null>(null);
  const [form, setForm] = useState({
    profileName: "",
    siteUrl: "",
    username: "",
    appPassword: "",
    blogName: "",
    blogDescription: "",
  });

  // Fetch profiles on load
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/blog-profile");
      const data = await res.json();
      setProfiles(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `/api/blog-profiles/${editing._id}`
        : "/api/blog-profiles";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save profile");

      setForm({
        profileName: "",
        siteUrl: "",
        username: "",
        appPassword: "",
        blogName: "",
        blogDescription: "",
      });
      setEditing(null);
      fetchProfiles();
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this profile?")) return;
    try {
      await fetch(`/api/blog-profiles/${id}`, { method: "DELETE" });
      fetchProfiles();
    } catch (err) {
      console.error(err);
      alert("Failed to delete profile");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await fetch(`/api/blog-profiles/${id}/default`, { method: "POST" });
      fetchProfiles();
    } catch (err) {
      console.error(err);
      alert("Failed to set default");
    }
  };

  const startEdit = (profile: BlogProfile) => {
    setEditing(profile);
    setForm({
      profileName: profile.profileName,
      siteUrl: profile.siteUrl,
      username: profile.username,
      appPassword: profile.appPassword,
      blogName: profile.blogName,
      blogDescription: profile.blogDescription || "",
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold">Manage Blog Profiles</h1>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border rounded-xl shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {editing ? "Edit Profile" : "Add New Profile"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Profile Name"
            value={form.profileName}
            onChange={(e) => setForm({ ...form, profileName: e.target.value })}
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="url"
            placeholder="Site URL"
            value={form.siteUrl}
            onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="password"
            placeholder="Application Password"
            value={form.appPassword}
            onChange={(e) => setForm({ ...form, appPassword: e.target.value })}
            className="p-3 border rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="Blog Name"
            value={form.blogName}
            onChange={(e) => setForm({ ...form, blogName: e.target.value })}
            className="p-3 border rounded-lg w-full col-span-2"
          />
          <textarea
            placeholder="Blog Description"
            value={form.blogDescription}
            onChange={(e) =>
              setForm({ ...form, blogDescription: e.target.value })
            }
            className="p-3 border rounded-lg w-full col-span-2"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
          >
            {editing ? "Update Profile" : "Save Profile"}
          </button>
          {editing && (
            <button
              onClick={() => {
                setEditing(null);
                setForm({
                  profileName: "",
                  siteUrl: "",
                  username: "",
                  appPassword: "",
                  blogName: "",
                  blogDescription: "",
                });
              }}
              className="px-6 py-3 bg-gray-300 rounded-lg font-semibold hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </motion.div>

      {/* Profile List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Saved Profiles</h2>
        {profiles.length === 0 && <p>No profiles yet.</p>}
        {profiles.map((profile) => (
          <div
            key={profile._id}
            className="p-4 border rounded-lg flex items-center justify-between"
          >
            <div>
              <p className="font-bold">{profile.profileName}</p>
              <p className="text-sm text-gray-600">{profile.blogName}</p>
              <p className="text-xs text-gray-500">{profile.siteUrl}</p>
              {profile.isDefault && (
                <span className="text-green-600 text-xs font-semibold">
                  (Default)
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => startEdit(profile)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(profile._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
              {!profile.isDefault && (
                <button
                  onClick={() => handleSetDefault(profile._id)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Set Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
