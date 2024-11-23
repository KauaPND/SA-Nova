// src/pages/CreateProduct.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './style/createProduct.css';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    imageUrl: '',
    description: '',
    stockQuantity: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Converte o preço para número
      const formattedData = {
        ...productData,
        price: parseFloat(productData.price),
        stockQuantity: parseInt(productData.stockQuantity, 10)
      };

      await api.post('/products', formattedData);
      alert('Produto criado com sucesso!');
      navigate('/admin');
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      alert('Erro ao criar produto. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product-container">
      <h1>Criar Produto</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nome do Produto"
          value={productData.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Preço"
          value={productData.price}
          onChange={handleChange}
          step="0.01"
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="URL da Imagem"
          value={productData.imageUrl}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stockQuantity"
          placeholder="Quantidade em Estoque"
          value={productData.stockQuantity}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descrição do Produto"
          value={productData.description}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Produto'}
        </button>
      </form>
      <button 
        onClick={() => navigate('/admin')} 
        className="back-button"
        disabled={loading}
      >
        Voltar
      </button>
    </div>
  );
};

export default CreateProductPage;