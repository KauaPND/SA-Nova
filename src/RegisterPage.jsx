import React, { useState } from 'react';
import './RegisterPage.css';
import api from './api';

function RegisterPage({ onRegisterSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password || !confirmPassword || !cpf || !cep) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
  
    try {
      await api.post('/auth/register', { email, password, cpf, cep });
      alert('Usuário registrado com sucesso!');
      onRegisterSubmit();
    } catch (error) {
      console.error('Erro ao registrar:', error.response?.data || error.message);
      alert('Erro ao registrar usuário.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Cadastre-se!</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Repetir senha"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="CPF"
            required
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          <input
            type="text"
            placeholder="CEP"
            required
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
          <button type="submit">CADASTRAR</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
