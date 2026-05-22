import { Navigate } from 'react-router-dom';

interface RouteProps {
  children: React.ReactNode;
}

// Para rotas que só usuários NÃO LOGADOS podem acessar (cadastro)
export function GuestRoute({ children }: RouteProps) {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (token && userType) {
    let dashboardPath = '/';
    
    switch (userType) {
      case 'passenger':
        dashboardPath = '/passageiro/painel';
        break;
      case 'driver':
        dashboardPath = '/motorista/painel';
        break;
      case 'admin':
        dashboardPath = '/administrador/painel';
        break;
    }
    
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
}

// Para rotas que só usuários LOGADOS podem acessar (perfil, painel)
export function AuthProtectedRoute({ children }: RouteProps) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}