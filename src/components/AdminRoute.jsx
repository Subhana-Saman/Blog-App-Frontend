import { Navigate } from "react-router-dom";

export default function AdminRoute({
  children,
}) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // NOT LOGGED IN
  if (!user) {

    return <Navigate to="/login" />;

  }

  // NOT ADMIN
  if (user.role !== "admin") {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-[#020617]
          text-white
        "
      >

        <div
          className="
            text-center
            p-10
            rounded-3xl
            bg-white/5
            border
            border-red-500/20
          "
        >

          <h1
            className="
              text-5xl
              font-black
              text-red-400
              mb-4
            "
          >
            Access Denied
          </h1>

          <p className="text-gray-400">
            Admin access only
          </p>

        </div>

      </div>

    );

  }

  return children;

}