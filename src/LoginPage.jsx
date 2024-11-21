import React, { useState } from 'react';
import './LoginPage.css';
import api from './api';

const LoginPage = ({ onLogin, onRegisterClick, onAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin();
    } catch (error) {
      alert('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="login-page">
      <div className="welcome-section">
        <div className="logo">
          <img src="./imgs/logo.png" alt="Lost Plushy Logo" />
        </div>
        <h1>Bem-vindo ao Lost Plushy,</h1>
        <p>
          Onde o macabro encontra o adorável e o sinistro se mistura com o reconfortante.
          Somos uma empresa dedicada a criar pelúcias que desafiam as convenções do mundo
          do entretenimento infantil. Aqui, abraçamos o lado mais sombrio da imaginação,
          transformando o medo em algo que você pode abraçar.
        </p>
      </div>
      <div className="login-section">
        <div className="login-form">
          <h2>Lost Plushy</h2>
          <form>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={handleLogin}>
              LOGAR
            </button>
            <div className="register">
              <a href="#!" onClick={onRegisterClick}>
                Sem um login? Cadastre-se!
              </a>
            </div>
            <button type="button" className="admin-login" onClick={onAdminLogin}>
              LOGAR ADM
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
