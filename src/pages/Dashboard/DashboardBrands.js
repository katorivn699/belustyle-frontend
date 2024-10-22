import React, { useState, useEffect } from "react";
import { FaFilter, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../components/buttons/DeleteConfirmationModal"; // Import DeleteConfirmationModal
import { apiClient } from "../../core/api";
import useAuthUser from "react-auth-kit/hooks/useAuthUser"; // Import useAuthUser
import BrandDrawer from "../../components/drawer/DashboardBrandDrawer";

const DashboardBrands = () => {
  const [brands, setbrands] = useState([]); // State to store brands
  const [brandToDelete, setbrandToDelete] = useState(null); // State to delete brands
  const [isOpen, setIsOpen] = useState(false); // Manage modal open state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Manage drawer open state
  const [selectedbrand, setSelectedbrand] = useState(null); // State for the selected brand for drawer
  const navigate = useNavigate();

  const authUser = useAuthUser(); // Get the current user
  const userRole = authUser.role; // Get the user's role
  const varToken = localStorage.getItem("_auth");

  useEffect(() => {
    apiClient
      .get("/api/brands", {
        headers: {
          Authorization: "Bearer " + varToken,
        },
      })
      .then((response) => {
        setbrands(response.data); // Set the fetched data to brands state
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  const openDeleteModal = (brand) => {
    setbrandToDelete(brand);
    setIsOpen(true); // Open the modal
  };

  const handleClose = () => {
    setIsOpen(false); // Close the modal
  };

  const handleDelete = () => {
    if (brandToDelete) {
      apiClient
        .delete(`/api/brands/${brandToDelete.brandId}`, {
          headers: {
            Authorization: "Bearer " + varToken,
          },
        })
        .then(() => {
          setbrands(brands.filter((c) => c.brandId !== brandToDelete.brandId));
          setIsOpen(false); // Close the modal after deletion
        })
        .catch((error) => console.error("Error deleting brand:", error));
    }
  };

  const openDrawer = (brand) => {
    setSelectedbrand(brand);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleEdit = (brand) => {
    navigate(`/Dashboard/Brands/${brand.brandId}`); // Use navigate to go to the edit page
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Brands</h1>
        <div className="flex ">
          {userRole === "ADMIN" && ( // Show create button only for Admin
            <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
              <Link to="/Dashboard/Brands/Create" className="flex items-center">
                <FaPlus className="mr-2" /> Create New
              </Link>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border border-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Website</th>
              <th className="px-4 py-2 text-left">Brand Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Total Quantity</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {brands.map((brand) => (
              <tr key={brand.brandId} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <a
                    href={brand.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {brand.websiteUrl}
                  </a>
                </td>
                <td className="px-4 py-2">{brand.brandName}</td>
                <td className="px-4 py-2">{brand.brandDescription}</td>
                <td className="px-4 py-2">{brand.totalQuantity}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button
                    onClick={() => openDrawer(brand)}
                    className="text-green-500 cursor-pointer"
                  >
                    <FaEye />
                  </button>
                  <Link to={`/Dashboard/Brands/${brand.brandId}`}>
                    <FaEdit className="text-blue-500 cursor-pointer" />
                  </Link>
                  {userRole === "ADMIN" && ( // Show delete button only for Admin
                    <button
                      onClick={() => openDeleteModal(brand)}
                      className="text-red-500 cursor-pointer"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Use DeleteConfirmationModal component */}
      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleDelete}
        name={brandToDelete?.brandName || ""}
      />

      {/* brand Drawer */}
      <BrandDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        brand={selectedbrand || {}} // Pass selected brand to drawer
        onEdit={handleEdit}
      />
    </>
  );
};

export default DashboardBrands;