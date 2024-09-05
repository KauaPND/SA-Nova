import React, { useEffect } from 'react';
import './PaymentPage.css';

const PaymentPage = ({ onBack }) => {
  useEffect(() => {
    document.title = "Pagamento - Lost Plushy";
  }, []);

  return (
    <div className="payment-page">
      <header className="header">
        <button className="back-button" onClick={onBack}>⬅️</button>
        <h1>Pagamento</h1>
        <div className="logo">
          <img src="/logo.png" alt="Lost Plushy Logo" />
        </div>
      </header>

      <div className="payment-details">
        <div className="product-summary">
          <img src="/path/to/springtrap.jpg" alt="Pelúcia Spring Trap" />
          <div className="product-info">
            <h3>Boneco de Pelúcia "FNAF" Spring Trap</h3>
            <p>R$ 52,90</p>
            <button className="delete-button">🗑️ excluir item</button>
          </div>
        </div>

        <div className="payment-summary">
          <p>subtotal <span>R$52,90</span></p>
          <p>total <span>até 2x de R$ 26,45</span></p>
          <p>sem juros no cartão</p>
          <button className="confirm-button">CONFIRMAR</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
