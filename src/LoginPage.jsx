import React from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin, onRegisterClick, onAdminLogin }) => {
  return (
    <div className="login-page">
      <div className="welcome-section">
        <div className="logo">
          <img src="./imgs/logo.png" alt="Lost Plushy Logo" /> {/* Exibe o logotipo */}
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
            {/* Campo de email */}
            <input type="email" placeholder="Email" />
            {/* Campo de senha */}
            <input type="password" placeholder="Senha" />
            {/* Botão de login para usuário */}
            <button type="button" onClick={onLogin}>LOGAR</button>
            {/* Link para a página de registro */}
            <div className="register">
              <a href="#!" onClick={onRegisterClick}>
                Sem um login? Cadastre-se!
              </a>
            </div>
            {/* Botão de login para admin */}
            <button type="button" className="admin-login" onClick={onAdminLogin}>
              LOGAR ADM
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


export default LoginPage;
