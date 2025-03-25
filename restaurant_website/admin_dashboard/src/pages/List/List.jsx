import React, { useEffect, useState } from 'react';
import './List.css';
import axios from "axios";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/products/`); // Fixed template literal

      if (response.data.success) {
        setList(response.data.products);
        setFilteredProducts(response.data.products);
        const uniqueCategories = [...new Set(response.data.products.map(item => item.category))];
        setCategories(uniqueCategories);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch product list");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    let filtered = list;

    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, list, searchQuery]);

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`${url}/api/products/${productId}`);
      if (response.data.success) {
        fetchList(); // Update the list after deletion
        toast.success("Product deleted successfully");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="list-container">
      <header className="list-header">
        <h2 className="title">Product Catalog</h2>
        <div className="filters-container">
          <div className="filter-group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search products"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        </div>
      </header>

      <main className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div key={item._id} className="product-card">
              <div className="image-container">
                <img
                  src={item.image}
                  alt={item.name}
                  className="product-image"
                  loading="lazy"
                />
              </div>
              <div className="product-details">
                <h3 className="product-name">{item.name}</h3>
                <p className="product-category">{item.category}</p>
                <p className="product-price">Rs. {item.price.toLocaleString()}</p>
                <div className="button-group">
                  <Link
                    to={`/update-product/${item._id}`}
                    className="edit-btn"
                    aria-label={`Update ${item.name}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}
                    aria-label={`Delete ${item.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No products match your criteria</p>
            <button
              className="reset-btn"
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );

};

export default List;