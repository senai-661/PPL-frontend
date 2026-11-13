import { DriverUberLayout } from '../../Components/Layouts/DriverUberLayout/DriverUberLayout';
import { Link } from 'react-router-dom';

export function DriverDashboard() {
  const handleToggleOnline = (onlineStatus: boolean) => {
    console.log('Status do motorista:', onlineStatus);
  };

  return (
    <>
      <DriverUberLayout onToggleOnline={handleToggleOnline} />
      
      <Link 
        to="/motorista/corridas-agendadas"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#667eea',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '50px',
          textDecoration: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
          zIndex: 1000,
        }}
      >
        🚗 Corridas Agendadas
      </Link>
    </>
  );
}

export default DriverDashboard;