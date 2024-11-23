// src/pages/CartPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './style/CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      alert('Erro ao carregar carrinho.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      if (newQuantity > 0) {
        await api.put(`/cart/items/${itemId}`, { quantity: newQuantity });
        fetchCart();
      }
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      alert('Erro ao atualizar quantidade.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      fetchCart();
    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('Erro ao remover item do carrinho.');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (parseFloat(item.price_at_time) * item.quantity), 0
    ).toFixed(2);
  };

  if (loading) return <div className="loading">Carregando carrinho...</div>;

  return (
    <div className="cart-page">
      <header className="header">
        <button className="back-button" onClick={() => navigate('/products')}>
          ⬅️ Voltar
        </button>
        <h1>Meu Carrinho</h1>
        <div className="logo">
          <img src="/imgs/logo.png" alt="Lost Plushy Logo" />
        </div>
      </header>

      <div className="cart-content">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Seu carrinho está vazio</p>
            <button onClick={() => navigate('/products')}>
              Continuar Comprando
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image_url} alt={item.name} />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="price">R$ {parseFloat(item.price_at_time).toFixed(2)}</p>
                    <div className="quantity-controls">
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button 
                      className="remove-button"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h2>Resumo do Pedido</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>R$ {calculateTotal()}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>R$ {calculateTotal()}</span>
              </div>
              <button 
                className="checkout-button"
                onClick={() => navigate('/payment')}
              >
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;