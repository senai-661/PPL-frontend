import { UberLikeLayout, RideRequestData } from '../../app/components/UberLikeLayout';

export function PassengerDashboard() {
  const handleRequestRide = (data: RideRequestData) => {
    console.log('Viagem solicitada:', data);
    alert(`Viagem solicitada!\nDe: ${data.origin}\nPara: ${data.destination}`);
  };

  return <UberLikeLayout userType="passenger" onRequestRide={handleRequestRide} />;
}
