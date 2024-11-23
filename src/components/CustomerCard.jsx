// src/components/CustomerCard.jsx
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import '../pages/style/CustomerCard.css';

const CustomerCard = ({ customer, onClick }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  return (
    <div className="customer-card" onClick={onClick}>
      <div className="customer-header">
        <div className="customer-avatar">
          <span>{customer.email[0].toUpperCase()}</span>
        </div>
        <div className="customer-info">
          <h3>{customer.email}</h3>
          <p className="customer-since">
            Cliente há {formatDistanceToNow(new Date(customer.created_at), { locale: ptBR })}
          </p>
        </div>
      </div>
      <div className="customer-stats">
        <div className="stat-item">
          <label>Total Pedidos</label>
          <span>{customer.total_orders || 0}</span>
        </div>
        <div className="stat-item">
          <label>Total Gasto</label>
          <span>{formatCurrency(customer.total_spent)}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;