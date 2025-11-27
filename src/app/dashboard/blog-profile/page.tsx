
// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Globe, ShieldCheck, Edit, Trash2, Star } from "lucide-react";

// interface BlogProfile {
//   _id: string;
//   profileName: string;
//   siteUrl: string;
//   username: string;
//   appPassword: string;
//   blogName: string;
//   blogDescription?: string;
//   isDefault: boolean;
// }

// export default function BlogProfilesPage() {
//   const [profiles, setProfiles] = useState<BlogProfile[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [editing, setEditing] = useState<BlogProfile | null>(null);
//   const [form, setForm] = useState({
//     profileName: "",
//     siteUrl: "",
//     username: "",
//     appPassword: "",
//     blogName: "",
//     blogDescription: "",
//   });

//   /* Load profiles */
//   useEffect(() => {
//     fetchProfiles();
//   }, []);

//   const fetchProfiles = async () => {
//     try {
//       const res = await fetch("/api/blog-profile");
//       const data = await res.json();
//       setProfiles(data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       const method = editing ? "PUT" : "POST";
//       const url = editing
//         ? `/api/blog-profiles/${editing._id}`
//         : "/api/blog-profiles";

//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) throw new Error("Failed to save profile");

//       setForm({
//         profileName: "",
//         siteUrl: "",
//         username: "",
//         appPassword: "",
//         blogName: "",
//         blogDescription: "",
//       });
//       setEditing(null);
//       fetchProfiles();
//     } catch (err) {
//       console.error(err);
//       alert("Error saving profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this profile?")) return;
//     await fetch(`/api/blog-profiles/${id}`, { method: "DELETE" });
//     fetchProfiles();
//   };

//   const handleSetDefault = async (id: string) => {
//     await fetch(`/api/blog-profiles/${id}/default`, { method: "POST" });
//     fetchProfiles();
//   };

//   const startEdit = (profile: BlogProfile) => {
//     setEditing(profile);
//     setForm({
//       profileName: profile.profileName,
//       siteUrl: profile.siteUrl,
//       username: profile.username,
//       appPassword: profile.appPassword,
//       blogName: profile.blogName,
//       blogDescription: profile.blogDescription || "",
//     });
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 6 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.35 }}
//       className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10"
//     >
//       {/* Title */}
//       <div className="space-y-1 text-center">
//         <h1 className="text-3xl font-semibold tracking-tight">
//           WordPress Blog Profiles
//         </h1>
//         <p className="text-sm text-muted-foreground">
//           Save multiple WordPress sites and switch publishing destinations effortlessly.
//         </p>
//       </div>

//       {/* Form Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 8 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="
//           rounded-2xl border border-border/60 p-6 shadow-[0_0_25px_-12px_rgba(0,0,0,0.25)]
//           bg-card/70 backdrop-blur-xl space-y-5
//         "
//       >
//         <h2 className="text-lg font-medium">
//           {editing ? "Edit Blog Profile" : "Add New Blog Profile"}
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {[
//             { key: "profileName", placeholder: "Profile Name" },
//             { key: "siteUrl", placeholder: "Site URL" },
//             { key: "username", placeholder: "Username" },
//             { key: "appPassword", placeholder: "Application Password", type: "password" },
//           ].map((field) => (
//             <input
//               key={field.key}
//               type={field.type || "text"}
//               placeholder={field.placeholder}
//               value={(form as any)[field.key]}
//               onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
//               className="p-3 rounded-lg border border-border/60 bg-background text-sm w-full"
//             />
//           ))}

//           <input
//             placeholder="Blog Name"
//             value={form.blogName}
//             onChange={(e) => setForm({ ...form, blogName: e.target.value })}
//             className="p-3 rounded-lg border border-border/60 bg-background text-sm w-full col-span-2"
//           />

//           <textarea
//             placeholder="Blog Description (optional)"
//             value={form.blogDescription}
//             onChange={(e) =>
//               setForm({ ...form, blogDescription: e.target.value })
//             }
//             className="p-3 rounded-lg border border-border/60 bg-background text-sm w-full col-span-2"
//           />
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="
//               px-6 py-3 my-4 rounded-xl font-medium text-white bg-ai-accent
//               hover:bg-ai-accent/90 transition
//               disabled:opacity-60
//             "
//           >
//             {editing ? "Update Profile" : "Save Profile"}
//           </button>

//           {editing && (
//             <button
//               onClick={() => {
//                 setEditing(null);
//                 setForm({
//                   profileName: "",
//                   siteUrl: "",
//                   username: "",
//                   appPassword: "",
//                   blogName: "",
//                   blogDescription: "",
//                 });
//               }}
//               className="px-6 py-3 rounded-xl font-medium bg-secondary hover:bg-secondary/70"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </motion.div>

//       {/* List */}
//       <div className="space-y-3">
//         <h2 className="text-lg font-medium">Saved Profiles</h2>
//         {profiles.length === 0 && (
//           <p className="text-muted-foreground text-sm">No profiles yet.</p>
//         )}

//         {profiles.map((profile, index) => (
//           <motion.div
//             key={profile._id}
//             initial={{ opacity: 0, y: 8 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.05 }}
//             className="
//               flex items-center justify-between p-5 rounded-xl
//               border border-border/60 shadow-sm bg-card/60 backdrop-blur
//             "
//           >
//             <div className="space-y-1">
//               <p className="font-semibold flex items-center gap-2">
//                 {profile.profileName}
//                 {profile.isDefault && (
//                   <span className="text-ai-accent text-xs font-semibold flex items-center gap-1">
//                     <ShieldCheck className="w-3 h-3" /> Default
//                   </span>
//                 )}
//               </p>
//               <p className="text-sm text-muted-foreground">{profile.blogName}</p>
//               <p className="text-xs flex items-center gap-1 text-muted-foreground">
//                 <Globe className="w-3 h-3" /> {profile.siteUrl}
//               </p>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => startEdit(profile)}
//                 className="p-2 rounded-lg bg-secondary hover:bg-secondary/80"
//               >
//                 <Edit className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => handleDelete(profile._id)}
//                 className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-600/20"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//               {!profile.isDefault && (
//                 <button
//                   onClick={() => handleSetDefault(profile._id)}
//                   className="p-2 rounded-lg bg-ai-accent/10 text-ai-accent hover:bg-ai-accent/20"
//                 >
//                   <Star className="w-4 h-4" />
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </motion.div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, ShieldCheck, Edit, Trash2, Star } from "lucide-react";

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
        ? `/api/blog-profiles/${editing._id}`
        : "/api/blog-profiles";

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
    if (!confirm("Delete profile?")) return;
    await fetch(`/api/blog-profiles/${id}`, { method: "DELETE" });
    fetchProfiles();
  };

  const handleSetDefault = async (id: string) => {
    await fetch(`/api/blog-profiles/${id}/default`, { method: "POST" });
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
                className="p-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20"
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
