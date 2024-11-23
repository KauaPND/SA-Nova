// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './style/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redireciona baseado no role do usuário
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="welcome-section">
        <div className="logo">
          <img src="/imgs/logo.png" alt="Lost Plushy Logo" />
        </div>
        <h1>Bem-vindo ao Lost Plushy</h1>
        <p>
          Onde o macabro encontra o adorável e o sinistro se mistura com o reconfortante.
          Somos uma empresa dedicada a criar pelúcias que desafiam as convenções do mundo
          do entretenimento infantil.
        </p>
      </div>
      <div className="login-section">
        <div className="login-form">
          <h2>Lost Plushy</h2>
          <form onSubmit={handleLogin}>
            {error && <div className="error-message">{error}</div>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Carregando...' : 'LOGAR'}
            </button>
            <div className="register">
              <button type="button" onClick={() => navigate('/register')}>
                Sem um login? Cadastre-se!
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;