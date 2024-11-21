import React, { useEffect, useState } from 'react';
import PaymentPage from './PaymentPage';
import './ProductPage.css';
import api from './api';

const ProductPage = ({ onBack }) => {
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    document.title = 'Produtos - Lost Plushy';

    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        console.log(response)
        setProducts(response.data);
      } catch (error) {
        alert('Erro ao carregar produtos.');
      }
    };

    fetchProducts();
  }, []);

  const handleCartClick = () => {
    setShowPaymentPage(true);
  };

  if (showPaymentPage) {
    return <PaymentPage onBack={() => setShowPaymentPage(false)} />;
  }

  return (
    <div className="product-page">
      <header className="header">
        <div className="logo">
          <img src="./imgs/logo.png" alt="Lost Plushy Logo" />
        </div>
        <div className="icons">
          <span role="img" aria-label="Search" className="icon">🔍</span>
          <span role="img" aria-label="Cart" className="icon" onClick={handleCartClick}>
            🛒
          </span>
        </div>
      </header>
      <div className="product-list">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={`${product.img}`} alt={product.name} />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>R$ {product.price}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="backbutton" onClick={onBack}>
        VOLTAR
      </button>
    </div>
  );
};

export default ProductPage;
