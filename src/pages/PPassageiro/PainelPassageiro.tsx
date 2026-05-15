import { UberLikeLayout, RideRequestData } from '../../Components/Layouts/UberLikeLayout/UberLikeLayout';
import { useToast } from '../../hooks/useToast';

export function PassengerDashboard() {
  const { success } = useToast();
  const handleRequestRide = (data: RideRequestData) => {
    console.log('Viagem solicitada:', data);
    success(`Viagem solicitada!\nDe: ${data.origin}\nPara: ${data.destination}`);
  };

  return <UberLikeLayout userType="passenger" onRequestRide={handleRequestRide} />;
}
