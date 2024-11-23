// src/pages/ProductPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './style/ProductPage.css';

const ProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        setError('Erro ao carregar produtos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await api.post('/cart/add', {
        productId,
        quantity: 1
      });
      alert('Produto adicionado ao carrinho!');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Erro ao adicionar produto ao carrinho.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="loading">Carregando produtos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-page">
      <header className="header">
        <div className="logo">
          <img src="/imgs/logo.png" alt="Lost Plushy Logo" />
        </div>
        <div className="icons">
          <span role="img" aria-label="Search" className="icon">🔍</span>
          <span 
        role="img" 
        aria-label="Cart" 
        className="icon" 
        onClick={() => navigate('/cart')}
        >
  🛒 
</span>
          <span 
            role="img" 
            aria-label="Logout" 
            className="icon" 
            onClick={handleLogout}
          >
            🚪
          </span>
        </div>
      </header>
      
      <div className="product-list">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
          <img src={product.image_url} alt={product.name} />
          {console.log(product.image_url)}
          <div className="product-info">
            <h3>{product.name}</h3>
            <p>R$ {product.price}</p>
            <button 
              onClick={() => handleAddToCart(product.id)}
              className="add-to-cart-button"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;