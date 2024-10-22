import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import DashboardAccountDrawer from "../../components/drawer/DashboardAccountDrawer";

const DashboardAccounts = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const navigate = useNavigate();
  const authUser = useAuthUser();
  const currentUser = authUser.username;
  const varToken = localStorage.getItem("_auth");

  useEffect(() => {
    fetchUsers(currentPage, pageSize);
  }, [currentPage]);

  const fetchUsers = (page, size) => {
    apiClient
      .get(`/api/admin?page=${page}&size=${size}`, {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleViewUser = (userId) => {
    setSelectedUserId(userId);
    setDrawerOpen(true);
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "text-red-700 bg-red-100 font-bold";
      case "STAFF":
        return "text-yellow-700 bg-yellow-100";
      case "CUSTOMER":
        return "text-green-700 bg-green-100";
      default:
        return "";
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 border border-gray-300 rounded-lg ${
            currentPage === i ? "bg-blue-500 text-white" : ""
          }`}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Accounts</h1>
        <Link to="/Dashboard/Accounts/Create">
          <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Create New
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.username} className="hover:bg-gray-50">
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td
                  className={`px-4 py-2 font-bold ${getRoleStyle(user.role)}`}
                >
                  {user.role}
                </td>
                {user.enable ? (
                  <td className="px-4 py-2 text-emerald-600 font-bold">
                    Enable
                  </td>
                ) : (
                  <td className="px-4 py-2 text-rose-600 font-bold">Disable</td>
                )}
                <td className="px-4 py-2 flex space-x-2">
                  <span
                    className="w-6 h-6 flex justify-center items-center"
                    onClick={() => handleViewUser(user.userId)} // Use username as ID
                  >
                    {user.role === "STAFF" || user.username === currentUser ? (
                      <FaEye
                        className={`cursor-pointer ${
                          user.username === currentUser
                            ? "text-orange-500"
                            : "text-green-500"
                        }`}
                      />
                    ) : null}
                  </span>
                  <Link to={`/Dashboard/Accounts/${user.userId}`}>
                    <FaEdit className="text-blue-500 cursor-pointer" />
                  </Link>
                  <FaTrash className="text-red-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="px-4 py-2 mx-1 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        {renderPageNumbers()}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 mx-1 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* User Details Drawer */}
      <DashboardAccountDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userId={selectedUserId}
      />
    </>
  );
};

export default DashboardAccounts;