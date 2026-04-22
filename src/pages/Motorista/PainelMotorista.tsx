import { DriverUberLayout } from '../../app/components/DriverUberLayout';

export function DriverDashboard() {
  const handleToggleOnline = (onlineStatus: boolean) => {
    console.log('Status do motorista:', onlineStatus);
  };

  return <DriverUberLayout onToggleOnline={handleToggleOnline} />;
}
