import React, { useState } from 'react';
import './CustomerHistory.css';

const CustomerHistory = ({ onBack }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Lista de clientes
  const customers = [
    { id: 1, name: 'Josias Silva' },
    { id: 2, name: 'Giga Chad' },
    { id: 3, name: 'Morango Tango' },
    { id: 4, name: 'Chim Panzé' },
    { id: 5, name: 'Mico Leão' }
  ];

  // Função para entrar no perfil de um cliente
  const handleCustomerClick = (customer) => {
    if (customer.name === 'Giga Chad') {
      // Dados específicos de Giga Chad
      setSelectedCustomer({
        ...customer,
        cargo: 'Gerente',
        salario: 'R$30.000',
        tempoNaEmpresa: '2 anos',
        dataDeNascimento: '01/04/1985'
      });
    } else if (customer.name === 'Morango Tango') {
      // Dados específicos de Morango Tango com compras
      setSelectedCustomer({
        ...customer,
        cargo: 'Cliente Regular',
        compras: [
          { item: 'Pelúcia Foxy', valor: 'R$ 49,90' },
          { item: 'Pelúcia Golden Freddy', valor: 'R$ 60,90' }
        ],
        salario: 'Não possui',
        tempoNaEmpresa: '1 ano',
        dataDeNascimento: '15/08/1990'
      });
    } else {
      // Para os outros clientes, apenas exibe o nome
      setSelectedCustomer(customer);
    }
  };

  return (
    <div className="customer-history-container">
      {selectedCustomer ? (
        <div className="customer-profile">
          <h1>Perfil do Usuário</h1>
          <p>Nome: {selectedCustomer.name}</p>
          <p>Cargo: {selectedCustomer.cargo}</p>
          <p>Salario: {selectedCustomer.salario}</p>
          <p>Tempo na empresa: {selectedCustomer.tempoNaEmpresa}</p>
          <p>Data de nascimento: {selectedCustomer.dataDeNascimento}</p>

          {/* Exibindo as compras, se existirem */}
          {selectedCustomer.compras && (
            <div className='customer-text'>
              <h3>Compras:</h3>
              <ul>
                {selectedCustomer.compras.map((compra, index) => (
                  <li key={index}>
                    {compra.item} - {compra.valor}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={() => setSelectedCustomer(null)}>VOLTAR</button>
        </div>
      ) : (
        <>
          <header className="customer-history-header">
            <h1>Histórico Clientes</h1>
            <div className="customer-history-icon"></div>
          </header>
          <ul className="customer-history-list">
            {customers.map(customer => (
              <li
                key={customer.id}
                className="customer-history-item"
                onClick={() => handleCustomerClick(customer)}
              >
                <div className="customer-avatar-placeholder"></div>
                <span className="customer-name">{customer.name}</span>
              </li>
            ))}
          </ul>
          <button className="customer-history-back-button" onClick={onBack}>
            VOLTAR
          </button>
        </>
      )}
    </div>
  );
};

export default CustomerHistory;
