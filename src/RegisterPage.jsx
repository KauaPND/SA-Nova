import React from 'react';
import './RegisterPage.css';

function RegisterPage({ onRegisterSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    // Aqui você pode adicionar a lógica para processar o registro do usuário

    // Depois de processar o registro, chamar a função de callback para voltar à tela de login
    onRegisterSubmit();
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h1>Cadastre-se!</h1>
        <form onSubmit={handleSubmit}>
          {/* Campo de email */}
          <input type="email" placeholder="Email" required />
          {/* Campo de senha */}
          <input type="password" placeholder="Senha" required />
          {/* Campo para repetir a senha */}
          <input type="password" placeholder="Repetir senha" required />
          {/* Campo de CPF */}
          <input type="text" placeholder="CPF" required />
          {/* Campo de CEP */}
          <input type="text" placeholder="CEP" required />
          {/* Botão de cadastro */}
          <button type="submit">CADASTRAR</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
