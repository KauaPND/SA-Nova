import React, { useState } from 'react';
import LoginPage from './LoginPage';
import ProductPage from './ProductPage';
import RegisterPage from './RegisterPage';
import CustomerHistory from './CustomerHistory';

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // Estado para verificar se o usuário está logado
  const [isRegistering, setIsRegistering] = useState(false); // Estado para verificar se o usuário está na página de registro
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar se o usuário está logado como admin

  // Função chamada quando o usuário faz login
  const handleLogin = () => {
    setLoggedIn(true); // Atualiza o estado para indicar que o usuário está logado
  };

  // Função para voltar à página de login a partir de qualquer outra página
  const handleBack = () => {
    setLoggedIn(false);
    setIsRegistering(false);
    setIsAdmin(false); // Volta para o estado inicial e remove o estado admin
  };

  // Função chamada quando o usuário quer ir para a página de registro
  const handleRegisterClick = () => {
    setIsRegistering(true); // Atualiza o estado para exibir a página de registro
  };

  // Função chamada ao enviar o formulário de registro
  const handleRegisterSubmit = () => {
    setIsRegistering(false); // Após o registro, volta para a página de login
  };

  // Função chamada quando o usuário clica em "Logar ADM"
  const handleAdminLogin = () => {
    setIsAdmin(true); // Atualiza o estado para exibir a página de admin
  };

  // Renderiza as diferentes páginas com base no estado atual
  return (
    <div className="App">
      {isAdmin ? (
        <CustomerHistory onBack={handleBack} /> // Exibe a página de admin
      ) : loggedIn ? (
        <ProductPage onBack={handleBack} /> // Exibe a página de produtos
      ) : isRegistering ? (
        <RegisterPage onRegisterSubmit={handleRegisterSubmit} /> // Exibe a página de registro
      ) : (
        <LoginPage onLogin={handleLogin} onRegisterClick={handleRegisterClick} onAdminLogin={handleAdminLogin} /> // Exibe a página de login
      )}
    </div>
  );
}

export default App;
