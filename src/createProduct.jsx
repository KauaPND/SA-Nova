import React, { useState } from 'react';
import api from './api';
import './CreateProduct.css';

const CreateProduct = ({ onBack }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !imageUrl) {
      alert('Nome, preço e URL da imagem são obrigatórios.');
      return;
    }

    try {
      await api.post('/products', { name, price, imageUrl });
      alert('Produto criado com sucesso!');
      setName('');
      setPrice('');
      setImageUrl('');
    } catch (error) {
      console.error('Erro ao criar produto:', error.response?.data || error.message);
      alert('Erro ao criar produto.');
    }
  };

  return (
    <div className="create-product-container">
      <h1>Criar Produto</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do Produto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL da Imagem"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button type="submit">Criar Produto</button>
      </form>
      <button onClick={onBack} className="back-button">Voltar</button>
    </div>
  );
};

export default CreateProduct;
