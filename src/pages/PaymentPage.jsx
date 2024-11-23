// src/pages/PaymentPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './style/PaymentPage.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [installments, setInstallments] = useState(1);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get('/cart');
        setCartItems(response.data.items || []);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        alert('Erro ao carregar dados do carrinho.');
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (parseFloat(item.price_at_time) * item.quantity), 0
    ).toFixed(2);
  };

  const calculateInstallmentValue = () => {
    const total = parseFloat(calculateTotal());
    return (total / installments).toFixed(2);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    try {
      // Simulação de processamento de pagamento
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simula delay da API

      // Criar pedido no backend
      await api.post('/orders', {
        paymentMethod,
        installments,
        shippingAddress: "Endereço do usuário" // Em uma implementação real, isso viria do formulário
      });

      alert('Pagamento realizado com sucesso!');
      navigate('/products');
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Processando...</div>;

  return (
    <div className="payment-page">
      <header className="payment-header">
        <button className="back-button" onClick={() => navigate('/cart')}>
          ⬅️ Voltar para o carrinho
        </button>
        <h1>Finalizar Compra</h1>
        <div className="logo">
          <img src="/imgs/logo.png" alt="Lost Plushy Logo" />
        </div>
      </header>

      <div className="payment-container">
        <div className="order-summary">
          <h2>Resumo do Pedido</h2>
          <div className="cart-items-summary">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-summary">
                <img src={item.image_url} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Quantidade: {item.quantity}</p>
                  <p className="item-price">
                    R$ {(item.price_at_time * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="total-summary">
            <p>Total: R$ {calculateTotal()}</p>
          </div>
        </div>

        <div className="payment-form">
          <h2>Dados do Pagamento</h2>
          <form onSubmit={handleConfirmPayment}>
            <div className="payment-method">
              <h3>Forma de Pagamento</h3>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit"
                    checked={paymentMethod === 'credit'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cartão de Crédito
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="pix"
                    checked={paymentMethod === 'pix'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  PIX
                </label>
              </div>
            </div>

            {paymentMethod === 'credit' && (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Número do Cartão"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Nome no Cartão"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/AA"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <select
                    value={installments}
                    onChange={(e) => setInstallments(parseInt(e.target.value))}
                  >
                    <option value={1}>À vista - R$ {calculateTotal()}</option>
                    <option value={2}>2x de R$ {calculateInstallmentValue()}</option>
                    <option value={3}>3x de R$ {calculateInstallmentValue()}</option>
                    <option value={4}>4x de R$ {calculateInstallmentValue()}</option>
                    <option value={5}>5x de R$ {calculateInstallmentValue()}</option>
                    <option value={6}>6x de R$ {calculateInstallmentValue()}</option>
                  </select>
                </div>
              </>
            )}

            {paymentMethod === 'pix' && (
              <div className="pix-payment">
                <div className="qr-code-placeholder">
                  <p>QR Code do PIX</p>
                  <div className="fake-qr-code"></div>
                </div>
                <p>Valor: R$ {calculateTotal()}</p>
                <button type="button" className="copy-button">
                  Copiar Código PIX
                </button>
              </div>
            )}

            <button 
              type="submit" 
              className="confirm-payment-button"
              disabled={loading}
            >
              {loading ? 'Processando...' : 'Confirmar Pagamento'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;