


"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, ShieldCheck, Edit, Trash2, Star } from "lucide-react";
import { showToast } from "@/lib/toast";

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

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    const res = await fetch("/api/blog-profile");
    const data = await res.json();
    setProfiles(data || []);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `/api/blog-profile/${editing._id}`
        : "/api/blog-profile";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

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
    } finally {
      setLoading(false);
    }
  };




  const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this blog profile?")) return;

  try {
    const res = await fetch(`/api/blog-profile/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      showToast({ 
  type: "error",
  title: "Delete failed",
  description: data.error || "Unable to delete profile",
})
      return;
    }

    fetchProfiles();
  } catch {
    alert("Something went wrong while deleting the profile");
  }
};

  const handleSetDefault = async (id: string) => {
    await fetch(`/api/blog-profile/${id}/default`, { method: "POST" });
    fetchProfiles();
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
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-4xl mx-auto px-4 xl:px-6 py-10 space-y-10"
    >
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          WordPress Blog Profiles
        </h1>
        <p className="text-sm text-muted-foreground">
          Save multiple WordPress sites once — publish blogs instantly with 1 click.
        </p>
      </div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="
          rounded-2xl p-6 space-y-6
          bg-card/70 backdrop-blur-xl
          border border-border/60
          shadow-[0_4px_30px_-10px_rgba(0,0,0,0.35)]
          hover:shadow-[0_4px_40px_-8px_var(--ai-accent)]
          transition-all
        "
      >
        <h2 className="text-lg font-medium">
          {editing ? "Edit Blog Profile" : "Add a New Blog Profile"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: "profileName", placeholder: "Profile Name" },
            { key: "siteUrl", placeholder: "WordPress Site URL" },
            { key: "username", placeholder: "Username" },
            { key: "appPassword", placeholder: "Application Password", type: "password" },
          ].map((field) => (
            <input
              key={field.key}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={(form as any)[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="
                p-3 rounded-lg bg-background border border-border/60
                text-sm focus:ring-2 focus:ring-ai-accent/40 focus:border-ai-accent/50
              "
            />
          ))}

          <input
            placeholder="Blog Name"
            value={form.blogName}
            onChange={(e) => setForm({ ...form, blogName: e.target.value })}
            className="p-3 rounded-lg bg-background border border-border/60 text-sm col-span-2"
          />

          <textarea
            placeholder="Blog Description (optional)"
            value={form.blogDescription}
            onChange={(e) =>
              setForm({ ...form, blogDescription: e.target.value })
            }
            className="p-3 rounded-lg bg-background border border-border/60 text-sm col-span-2"
          />
        </div>

        {/* Save/Cancel */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="
              px-6 py-3 rounded-xl font-medium text-white bg-ai-accent
              hover:bg-ai-accent/90 transition shadow-[0_0_10px_-4px_var(--ai-accent)]
              disabled:opacity-60
            "
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
              className="px-6 py-3 rounded-xl font-medium bg-secondary hover:bg-secondary/80"
            >
              Cancel
            </button>
          )}
        </div>
      </motion.div>

      {/* Profile List */}
      <div className="space-y-3">
        <h2 className="text-lg font-medium">Saved Profiles</h2>

        {profiles.length === 0 && (
          <p className="text-sm text-muted-foreground">No profiles added yet.</p>
        )}

        {profiles.map((profile, index) => (
          <motion.div
            key={profile._id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="
              p-5 rounded-xl flex items-center justify-between
              bg-card/70 backdrop-blur-xl
              border border-border/60
              shadow-[0_4px_25px_-12px_rgba(0,0,0,0.25)]
              hover:shadow-[0_4px_35px_-8px_var(--ai-accent)]
              transition-all
            "
          >
            <div className="space-y-1">
              <p className="font-semibold flex items-center gap-2">
                {profile.profileName}
                {profile.isDefault && (
                  <span className="text-ai-accent text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Default
                  </span>
                )}
              </p>
              <p className="text-sm text-muted-foreground">{profile.blogName}</p>
              <p className="text-xs flex items-center gap-1 text-muted-foreground">
                <Globe className="w-3 h-3" /> {profile.siteUrl}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(profile)}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
  onClick={() => handleDelete(profile._id)}
  disabled={profile.isDefault}
  className={`
    p-2 rounded-lg
    ${profile.isDefault
      ? "bg-gray-300/20 text-gray-400 cursor-not-allowed"
      : "bg-red-500/10 text-red-600 hover:bg-red-500/20"}
  `}
>
  <Trash2 className="w-4 h-4" />
</button>

              {!profile.isDefault && (
                <button
                  onClick={() => handleSetDefault(profile._id)}
                  className="p-2 rounded-lg bg-ai-accent/10 text-ai-accent hover:bg-ai-accent/20"
                >
                  <Star className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
