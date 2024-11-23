// src/components/CustomerDetailsModal.jsx
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../api';
import '../pages/style/CustomerDetailsModal.css';

const CustomerDetailsModal = ({ customer, onClose }) => {
  const [details, setDetails] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCustomerData();
  }, [customer.id]);

  const fetchCustomerData = async () => {
    try {
      const [detailsRes, analyticsRes] = await Promise.all([
        api.get(`/customers/${customer.id}`),
        api.get(`/customers/${customer.id}/analytics`)
      ]);
      setDetails(detailsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (loading) return (
    <div className="modal-overlay">
      <div className="modal-content loading">
        <div className="loading-spinner"></div>
        <p>Carregando dados do cliente...</p>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Detalhes do Cliente</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>

        <div className="customer-profile">
          <div className="customer-avatar-large">
            <span>{customer.email[0].toUpperCase()}</span>
          </div>
          <h3>{customer.email}</h3>
          {details?.stats && (
            <div className="customer-quick-stats">
              <div className="quick-stat">
                <span>Total Gasto</span>
                <strong>{formatCurrency(details.stats.total_spent)}</strong>
              </div>
              <div className="quick-stat">
                <span>Pedidos</span>
                <strong>{details.stats.total_orders}</strong>
              </div>
              <div className="quick-stat">
                <span>Média/Pedido</span>
                <strong>{formatCurrency(details.stats.total_spent / details.stats.total_orders)}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </button>
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Pedidos
          </button>
          <button 
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Análises
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="customer-details">
                <div className="detail-item">
                  <label>CPF:</label>
                  <span>{details?.cpf || 'Não informado'}</span>
                </div>
                <div className="detail-item">
                  <label>CEP:</label>
                  <span>{details?.cep || 'Não informado'}</span>
                </div>
                <div className="detail-item">
                  <label>Cliente desde:</label>
                  <span>{format(new Date(details?.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                </div>
                <div className="detail-item">
                  <label>Última compra:</label>
                  <span>
                    {details?.stats.last_purchase 
                      ? format(new Date(details.stats.last_purchase), 'dd/MM/yyyy', { locale: ptBR })
                      : 'Nenhuma compra'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-tab">
              {details?.orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <h4>Pedido #{order.id}</h4>
                    <span className={`order-status ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-items">
                    {order.items.map(item => (
                      <div key={item.id} className="order-item">
                        <img src={item.image_url} alt={item.name} />
                        <div className="item-details">
                          <p>{item.name}</p>
                          <span>{item.quantity}x {formatCurrency(item.price_at_time)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <span>Data: {format(new Date(order.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    <span>Total: {formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-tab">
              {analytics?.map(month => (
                <div key={month.month} className="analytics-card">
                  <h4>{format(new Date(month.month), 'MMMM yyyy', { locale: ptBR })}</h4>
                  <div className="analytics-grid">
                    <div className="analytics-item">
                      <label>Pedidos</label>
                      <span>{month.orders_count}</span>
                    </div>
                    <div className="analytics-item">
                      <label>Total Gasto</label>
                      <span>{formatCurrency(month.total_spent)}</span>
                    </div>
                    <div className="analytics-item">
                      <label>Média por Pedido</label>
                      <span>{formatCurrency(month.average_order_value)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;