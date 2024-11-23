
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;