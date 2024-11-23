// src/pages/AdminPage.jsx
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Área do Administrador</h1>
      </header>
      
      <div className="admin-actions">
        <button 
          onClick={() => navigate('/admin/create-product')} 
          className="admin-button"
        >
          Criar Produto
        </button>
        
        <button 
          onClick={() => navigate('/admin/customers')} 
          className="admin-button"
        >
          Histórico de Clientes
        </button>
        
        <button 
          onClick={handleLogout} 
          className="admin-button logout-button"
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default AdminPage;