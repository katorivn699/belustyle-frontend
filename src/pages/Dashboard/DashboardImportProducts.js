import React, { useState, useEffect } from "react";
import { apiClient } from "../../core/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const DashboardImportProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedVariations, setSelectedVariations] = useState({});
  const varToken = useAuthHeader();
  const { stockId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/api/products", {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, [varToken]);

  const handleVariationChange = (variationId, quantity) => {
    setSelectedVariations((prev) => {
      const updatedVariations = { ...prev };
      if (quantity > 0) {
        updatedVariations[variationId] = parseInt(quantity);
      } else {
        delete updatedVariations[variationId];
      }
      return updatedVariations;
    });
  };

  const handleSubmit = () => {
    const variations = Object.entries(selectedVariations).map(
      ([variationId, quantity]) => ({
        productVariationId: parseInt(variationId),
        quantity,
      })
    );

    const payload = {
      stockId,
      variations,
    };

    apiClient
      .post("/api/stock-transactions", payload, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        toast.success("Import successfully", {
          position: "bottom-right",
          transition: Zoom,
        });
        navigate(`/Dashboard/Warehouse/${stockId}`);
      })
      .catch((error) => {
        toast.error("Import failed", {
          position: "bottom-right",
          transition: Zoom,
        });
      });
  };

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Import Products into Stock #{stockId}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.productId}
            product={product}
            onVariationChange={handleVariationChange}
            selectedVariations={selectedVariations}
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="block mt-8 mx-auto px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition duration-200"
      >
        Submit
      </button>
    </div>
  );
};

const ProductCard = ({ product, onVariationChange, selectedVariations }) => {
  const [variations, setVariations] = useState([]);
  const varToken = useAuthHeader();

  useEffect(() => {
    apiClient
      .get(`/api/products/${product.productId}/product-variations`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => setVariations(response.data.productVariations))
      .catch((error) => console.error("Error fetching variations:", error));
  }, [product.productId, varToken]);

  return (
    <div
      className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-lg transition duration-200"
      style={{ minWidth: "350px" }}
    >
      <div className="flex items-center mb-4">
        <img
          src={product.productVariationImage}
          alt={product.productName}
          className="w-20 h-20 rounded-lg shadow mr-4 object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {product.productName}
          </h2>
          <p className="text-sm text-gray-600">{product.productDescription}</p>
          <p className="text-sm text-gray-600">Brand: {product.brandName}</p>
          <p className="text-sm text-gray-600">
            Category: {product.categoryName}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {variations.map((variation) => (
          <VariationCard
            key={variation.variationId}
            variation={variation}
            onVariationChange={onVariationChange}
            isSelected={selectedVariations[variation.variationId] > 0}
          />
        ))}
      </div>
    </div>
  );
};

const VariationCard = ({ variation, onVariationChange, isSelected }) => {
  const [quantity, setQuantity] = useState(0);
  const [showInput, setShowInput] = useState(false);

  const handleCardClick = () => {
    if (!showInput) {
      setShowInput(true);
      setQuantity(quantity || 1);
      onVariationChange(variation.variationId, quantity || 1);
    } else {
      setShowInput(false);
      onVariationChange(variation.variationId, 0);
      setQuantity(0);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setQuantity(value);
    onVariationChange(variation.variationId, value);
  };

  return (
    <div
      className={`p-2 rounded-lg border text-center shadow-sm cursor-pointer transition duration-200 ${
        isSelected ? "border-green-500 bg-green-50" : "bg-gray-50"
      }`}
      onClick={handleCardClick}
      style={{ minWidth: "100px", maxWidth: "110px" }}
    >
      <img
        src={variation.productVariationImage}
        alt={`${variation.size.sizeName} ${variation.color.colorName}`}
        className="w-full h-16 rounded-lg object-cover mb-1"
      />
      <p className="text-xs font-medium text-gray-700">
        Size: {variation.size.sizeName}
      </p>
      <p className="text-xs text-gray-700">
        Color: {variation.color.colorName}
      </p>
      <p className="text-xs font-semibold text-gray-800">
        Price: ${variation.productPrice}
      </p>
      {showInput && (
        <input
          type="number"
          min="0"
          value={quantity}
          onClick={(e) => e.stopPropagation()}
          onChange={handleQuantityChange}
          placeholder="Quantity"
          className="mt-1 w-full p-1 border rounded focus:outline-none focus:ring focus:ring-green-200"
        />
      )}
    </div>
  );
};

export default DashboardImportProducts;
