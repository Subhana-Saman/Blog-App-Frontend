import { useState } from "react";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import API from "../utils/api";

import toast from "react-hot-toast";

import { loginSuccess } from "../redux/authSlice";

import {
  Camera,
  User,
  Mail,
  Shield,
  Users,
} from "lucide-react";



export default function Profile() {

  const dispatch = useDispatch();

  const { user, token } = useSelector(
    (state) => state.auth
  );

  const [username, setUsername] =
    useState(user?.username || "");

  const [bio, setBio] = useState(
    user?.bio || ""
  );

  const [avatar, setAvatar] =
    useState(null);

  const [preview, setPreview] =
    useState(user?.avatar || "");

  const [loading, setLoading] =
    useState(false);

  // 👇 FOLLOWERS STATE
  const [followers, setFollowers] =
    useState(
      user?.followers?.length || 0
    );

  // ================= IMAGE PREVIEW =================

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    setAvatar(file);

    if (file) {

      setPreview(
        URL.createObjectURL(file)
      );

    }

  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      // ================= UPDATE PROFILE =================

      const profileRes =
        await API.put(
          "/users/profile",
          {
            username,
            bio,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      let updatedUser =
        profileRes.data.user;

      // ================= IMAGE UPLOAD =================

      if (avatar) {

        const formData =
          new FormData();

        formData.append(
          "image",
          avatar
        );

        const imageRes =
          await API.put(
            "/users/upload-profile",
            formData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
            
                 
              },
            }
          );

        updatedUser =
          imageRes.data.user;

      }

      // ================= SAVE USER =================

      dispatch(
        loginSuccess({
          user: updatedUser,
          token,
        })
      );

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      toast.success(
        "Profile updated successfully"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Update failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div
      className="
        min-h-screen
        pt-32
        px-4
        bg-gradient-to-b
        from-[#020617]
        to-[#0f172a]
      "
    >

      <div
        className="
          max-w-5xl
          mx-auto
          rounded-[35px]
          border
          border-white/10
          bg-white/5
          backdrop-blur-2xl
          p-8
          shadow-2xl
        "
      >

        {/* ================= HEADER ================= */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-10
            flex-wrap
            gap-4
          "
        >

          <div>

            <h1
              className="
                text-4xl
                md:text-5xl
                font-black
                bg-gradient-to-r
                from-cyan-400
                to-teal-400
                bg-clip-text
                text-transparent
              "
            >
              My Profile
            </h1>

            <p className="text-gray-400 mt-2">
              Manage your profile settings
            </p>

          </div>

          <div
            className="
              px-5
              py-2
              rounded-2xl
              bg-cyan-500/10
              border
              border-cyan-500/20
              text-cyan-400
              font-semibold
            "
          >
            {user?.role || "user"}
          </div>

        </div>

        {/* ================= FOLLOWERS CARD ================= */}

        <div
          className="
            grid
            md:grid-cols-3
            gap-5
            mb-10
          "
        >

          <div
            className="
              p-6
              rounded-2xl
              bg-white/5
              border
              border-white/10
            "
          >

            <div className="flex items-center gap-3">

              <Users className="text-cyan-400" />

              <div>

                <h2 className="text-3xl font-black">
                  {followers}
                </h2>

                <p className="text-gray-400">
                  Followers
                </p>

              </div>

            </div>

          </div>

          <div
            className="
              p-6
              rounded-2xl
              bg-white/5
              border
              border-white/10
            "
          >

            <h2 className="text-3xl font-black">
              {
                user?.following
                  ?.length || 0
              }
            </h2>

            <p className="text-gray-400">
              Following
            </p>

          </div>

          <div
            className="
              p-6
              rounded-2xl
              bg-white/5
              border
              border-white/10
            "
          >

            <h2 className="text-3xl font-black">
              {
                user?.bookmarks
                  ?.length || 0
              }
            </h2>

            <p className="text-gray-400">
              Saved Blogs
            </p>

          </div>

        </div>

        

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ================= PROFILE IMAGE ================= */}

          <div
            className="
              flex
              flex-col
              items-center
              gap-5
            "
          >

            <div className="relative">

           <img  
  src={
    preview?.startsWith("http") || preview?.startsWith("blob")
      ? preview
      : "/default.png"   // FIX: localhost fallback hata diya
  }
  alt="profile"
  className="w-36 h-36 rounded-full object-cover border-4 border-cyan-500 shadow-lg"
  onError={(e) => { e.target.onerror = null; e.target.src = "/default.png"; }}
/>

              <label
                className="
                  absolute
                  bottom-2
                  right-2
                  w-10
                  h-10
                  rounded-full
                  bg-cyan-500
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  shadow-lg
                "
              >

                <Camera size={18} />

                <input
                  type="file"
                  hidden
                  onChange={
                    handleImageChange
                  }
                />

              </label>

            </div>

          </div>

          {/* ================= USERNAME ================= */}

          <div>

            <label
              className="
                mb-2
                flex
                items-center
                gap-2
                text-sm
                text-gray-300
              "
            >

              <User size={16} />

              Username

            </label>

            <input
              type="text"
              value={username}
              required
              minLength={3}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              placeholder="Username"
              className="
                w-full
                p-4
                rounded-2xl
                bg-black/30
                border
                border-white/10
                outline-none
                focus:border-cyan-400
              "
            />

          </div>

          {/* ================= EMAIL ================= */}

          <div>

            <label
              className="
                mb-2
                flex
                items-center
                gap-2
                text-sm
                text-gray-300
              "
            >

              <Mail size={16} />

              Email

            </label>

            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="
                w-full
                p-4
                rounded-2xl
                bg-black/20
                border
                border-white/10
                text-gray-400
                cursor-not-allowed
              "
            />

          </div>

          {/* ================= BIO ================= */}

          <div>

            <label
              className="
                mb-2
                flex
                items-center
                gap-2
                text-sm
                text-gray-300
              "
            >

              <Shield size={16} />

              Bio

            </label>

            <textarea
              value={bio}
              required
              minLength={10}
              onChange={(e) =>
                setBio(
                  e.target.value
                )
              }
              placeholder="Write your bio..."
              rows={5}
              className="
                w-full
                p-4
                rounded-2xl
                bg-black/30
                border
                border-white/10
                outline-none
                focus:border-cyan-400
              "
            />

          </div>

          {/* ================= SAVE BUTTON ================= */}

          <button
            disabled={loading}
            className="
              w-full
              py-4
              rounded-2xl
              font-bold
              text-lg
              bg-gradient-to-r
              from-cyan-500
              to-teal-500
              hover:scale-[1.01]
              transition-all
              duration-300
              disabled:opacity-50
            "
          >
            {
              loading
                ? "Saving..."
                : "Save Changes"
            }
          </button>

        </form>

      </div>

    </div>

  );

}