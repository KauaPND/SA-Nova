import  { useState } from 'react';
import CreateProduct from './createProduct';
import './style/CustomerHistory.css';

const CustomerHistory = ({ onBack }) => {
  const [creatingProduct, setCreatingProduct] = useState(false);

  if (creatingProduct) {
    return <CreateProduct onBack={() => setCreatingProduct(false)} />;
  }

  return (
    <div className="customer-history-container">
      <header className="customer-history-header">
        <h1>Área do Administrador</h1>
      </header>
      <button onClick={() => setCreatingProduct(true)} className="create-product-button">
        Criar Produto
      </button>
      <button className="customer-history-back-button" onClick={onBack}>
        Voltar
      </button>
    </div>
  );
};

export default CustomerHistory;
