import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import { toast, Zoom } from "react-toastify";

const DashboardEditAccount = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isCustomer, setIsCustomer] = useState(false);
  const [enable, setEnable] = useState(false);
  const navigate = useNavigate();
  const varToken = localStorage.getItem("_auth");

  useEffect(() => {
    // Fetch user data to get the current status
    apiClient
      .get(`/api/admin/${userId}`, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        setUser(response.data);
        setEnable(response.data.enable);
        setIsCustomer(response.data.role === "CUSTOMER");
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userId, varToken]);

  const handleSave = () => {
    const updatedUser = {
      enable, // Only updating enable status
    };

    apiClient
      .put(`/api/admin/${userId}`, updatedUser, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then(
        (response) =>
          toast.success(response.data, {
            position: "bottom-right",
            transition: Zoom,
          }),
        navigate("/Dashboard/Accounts") // Redirect to accounts page
      )
      .catch((error) => {
        toast.error("Update user failed", {
          position: "bottom-right",
          transition: Zoom,
        });
      });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold">Edit Account</h1>
      <div>
        <label className="block text-gray-700">Username:</label>
        <input
          type="text"
          value={user.username}
          readOnly // Always read-only
          className="mt-2 border border-gray-300 rounded-lg p-2 w-full"
        />
      </div>
      <div>
        <label className="block text-gray-700">Email:</label>
        <input
          type="email"
          value={user.email}
          readOnly // Always read-only
          className="mt-2 border border-gray-300 rounded-lg p-2 w-full"
        />
      </div>
      <div>
        <label className="block text-gray-700">Role:</label>
        <input
          type="text"
          value={user.role}
          readOnly // Role should not be changed
          className="mt-2 border border-gray-300 rounded-lg p-2 w-full"
        />
      </div>
      <div>
        <label className="block text-gray-700">Status:</label>
        <button
          onClick={() => setEnable((prev) => !prev)}
          className={`mt-2 px-4 py-2 rounded-lg ${
            enable ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {enable ? "Enable" : "Disable"}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-300 text-black rounded-lg"
        >
          Go Back
        </button>
        {/* Conditionally show the "Save Changes" button for customers */}
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default DashboardEditAccount;
