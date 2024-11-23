// src/pages/CustomerListPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import CustomerDetailsModal from '../components/CustomerDetailsModal';
import './style/CustomerListPage.css';
import CustomerCard from '../components/CustomerCard';

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.cpf && customer.cpf.includes(searchTerm))
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Carregando clientes...</p>
    </div>
  );

  return (
    <div className="customer-list-page">
      <header className="customer-list-header">
        <h1>Histórico de Clientes</h1>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por email ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => navigate('/admin')} className="back-button">
            Voltar
          </button>
        </div>
      </header>

      <div className="customers-summary">
        <div className="summary-card">
          <h3>Total de Clientes</h3>
          <p>{customers.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total em Vendas</h3>
          <p>{formatCurrency(customers.reduce((acc, cur) => acc + (cur.total_spent || 0), 0))}</p>
        </div>
        <div className="summary-card">
          <h3>Média por Cliente</h3>
          <p>{formatCurrency(customers.reduce((acc, cur) => acc + (cur.total_spent || 0), 0) / customers.length || 0)}</p>
        </div>
      </div>

      <div className="customer-grid">
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onClick={() => setSelectedCustomer(customer)}
          />
        ))}
      </div>

      {selectedCustomer && (
        <CustomerDetailsModal 
          customer={selectedCustomer} 
          onClose={() => setSelectedCustomer(null)} 
        />
      )}
    </div>
  );
};

export default CustomerListPage;