import React, { useEffect, useState } from 'react';
import PaymentPage from './PaymentPage'; // Importar a página de pagamento
import './ProductPage.css';

const ProductPage = ({ onBack }) => {
  const [showPaymentPage, setShowPaymentPage] = useState(false);

  useEffect(() => {
    document.title = "Produtos - Lost Plushy";
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
          <img src="/logo.png" alt="Lost Plushy Logo" />
        </div>
        <div className="icons">
          <span role="img" aria-label="Search" className="icon">🔍</span>
          <span role="img" aria-label="Cart" className="icon" onClick={handleCartClick}>🛒</span>
        </div>
      </header>
      
      <div className="product-list">
        <div className="product-card">
          <img src="/path/to/springtrap.jpg" alt="Pelúcia Spring Trap" />
          <div className="product-info">
            <h3>Pelúcia Spring Trap</h3>
            <p>R$ 52,90</p>
          </div>
        </div>
        <div className="product-card">
          <img src="/path/to/goldenfreddy.jpg" alt="Pelúcia Golden Freddy" />
          <div className="product-info">
            <h3>Pelúcia Golden Freddy</h3>
            <p>R$ 60,90</p>
          </div>
        </div>
        <div className="product-card">
          <img src="/path/to/foxy.jpg" alt="Pelúcia Foxy" />
          <div className="product-info">
            <h3>Pelúcia Foxy</h3>
            <p>R$ 49,90</p>
          </div>
        </div>
        <div className="product-card">
          <img src="/path/to/shadowfreddy.jpg" alt="Pelúcia Shadow Freddy" />
          <div className="product-info">
            <h3>Pelúcia Shadow Freddy</h3>
            <p>R$ 60,90</p>
          </div>
        </div>
      </div>

      <button className="backbutton" onClick={onBack}>VOLTAR</button>
    </div>
  );
};

export default ProductPage;
