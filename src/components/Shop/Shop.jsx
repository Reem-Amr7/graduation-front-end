import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Shop.module.css";
import { useNavigate } from "react-router-dom";
import prof1 from "/src/assets/prof.jpg";
import defaultProductImage from "/src/assets/product1.jpg";

const PRODUCTS_PER_PAGE = 9;
const categories = ["الدوس", "المعمار", "منتجات الخاصة", "السجاد الديوني"];
const countries = ["مصر", "السعودية", "المغرب", "تونس", "الجزائر"];
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicmFtYWRhbmFzaHJ5NDRAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoicmFtYWRhbmFzaHJ5NDRAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVXNlciIsImV4cCI6MTc0NTk1MTg4MSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3QiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MDQ1LyJ9.-eL8YP1HbXJTfftzlnHsarZndub7IoeilcUUkuaP-gE"; // التوكن هنا

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [priceRange, setPriceRange] = useState(405);
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [],
    countries: [],
    price: 405,
  });
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const fetchProducts = () => {
    setLoading(true);
    axios
      .get("https://ourheritage.runasp.net/api/HandiCrafts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (Array.isArray(res.data.items)) {
          setAllProducts(res.data.items);
        } else {
          setAllProducts([]);
        }
      })
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      appliedFilters.categories.length === 0 ||
      appliedFilters.categories.includes(product.categoryName);
    const matchesCountry =
      appliedFilters.countries.length === 0 ||
      appliedFilters.countries.includes(product.countryName);
    const matchesPrice = product.price <= appliedFilters.price;
    return matchesCategory && matchesCountry && matchesPrice;
  });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters({
      categories: selectedCategories,
      countries: selectedCountries,
      price: priceRange,
    });
  };

  return (
    <div className={styles.shopContainer}>
      {/* الشريط الجانبي */}
      <div className={styles.filtersSidebar}>
        <h3 className={styles.filterTitle}>تصفية حسب</h3>

        <div className={styles.filterSection}>
          <h4>التصنيف</h4>
          {categories.map((category) => (
            <label key={category} className={styles.filterItem}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() =>
                  setSelectedCategories((prev) =>
                    prev.includes(category)
                      ? prev.filter((c) => c !== category)
                      : [...prev, category]
                  )
                }
              />
              {category}
            </label>
          ))}
        </div>

        <div className={styles.filterSection}>
          <h4>السعر</h4>
          <div className={styles.priceFilter}>
            <input
              type="range"
              min="0"
              max="405"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
            />
            <span>{priceRange} $</span>
          </div>
        </div>

        <div className={styles.filterSection}>
          <h4>الدولة</h4>
          {countries.map((country) => (
            <label key={country} className={styles.filterItem}>
              <input
                type="checkbox"
                checked={selectedCountries.includes(country)}
                onChange={() =>
                  setSelectedCountries((prev) =>
                    prev.includes(country)
                      ? prev.filter((c) => c !== country)
                      : [...prev, country]
                  )
                }
              />
              {country}
            </label>
          ))}
        </div>

        <button className={styles.applyButton} onClick={handleApplyFilters}>
          تطبيق
        </button>
      </div>

      {/* المنتجات */}
      <div className={styles.mainContent}>
        <div className={styles.productsGrid}>
          {loading ? (
            <div className={styles.loading}>جار التحميل...</div>
          ) : displayedProducts.length === 0 ? (
            <div className={styles.noResults}>لا توجد منتجات متاحة</div>
          ) : (
            displayedProducts.map((product) => (
              <div key={product.id} className={styles.productPost}>
                <div className={styles.postHeader}>
                  <div>
                    <p className={styles.username}>ANN JI</p>
                    <p className={styles.postDate}>منذ 3 أيام</p>
                  </div>
                  <img
                    src={prof1}
                    alt="User Profile"
                    className={styles.profileImage}
                  />
                </div>

                <img
                  onClick={() => Navigate(`/product-details/${product.id}`)}
                  src={
                    product.imageOrVideo && product.imageOrVideo.length > 0
                      ? product.imageOrVideo[0]
                      : defaultProductImage
                  }
                  alt={product.title || "صورة المنتج"}
                  className={styles.productImage}
                  onError={(e) => {
                    console.error(`الصورة مش موجودة: ${e.target.src}`);
                    e.target.onerror = null;
                    e.target.src = defaultProductImage;
                  }}
                />

                <div className={styles.productInfo}>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <div className={styles.productFooter}>
                    <button className={styles.cartButton}>
                      <i className="fa-solid fa-cart-shopping text-lg"></i>
                      <span className="font-semibold">{product.price}$</span>
                    </button>
                    <span className={styles.likes}>❤ {product.likes || 0}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* الترقيم */}
        {/* الترقيم */}
          <div className={styles.pagination}>
            <button 
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
    disabled={currentPage === 1}
  >
    السابق
  </button>

  {Array.from({ length: totalPages }, (_, i) => (
    <button 
      key={i + 1} 
      onClick={() => setCurrentPage(i + 1)} 
      className={currentPage === i + 1 ? styles.activePage : ""}
    >
      {i + 1}
    </button>
  ))}

  <button 
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
    disabled={currentPage === totalPages}
  >
    التالي
  </button>
         </div>

      </div>
    </div>
  );
};

export default Shop;


