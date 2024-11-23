import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './style/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    cep: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    try {
      await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        cpf: formData.cpf,
        cep: formData.cep
      });
      
      alert('Registro realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error('Erro ao registrar:', error);
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
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={formData.cpf}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="cep"
            placeholder="CEP"
            value={formData.cep}
            onChange={handleChange}
            required
          />
          <button type="submit">CADASTRAR</button>
          <button type="button" onClick={() => navigate('/login')} className="back-button">
            Voltar para Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
