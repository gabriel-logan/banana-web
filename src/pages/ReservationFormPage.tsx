import { FiArrowLeft } from "react-icons/fi";

import { ReservationForm } from "../components/reservations/ReservationForm";
import { Button } from "../components/ui/Button";

export function ReservationFormPage() {
  return (
    <div>
      <div>
        <Button>
          <FiArrowLeft /> Back
        </Button>
        <h1>New Reservation</h1>
      </div>
      <ReservationForm
        branches={[]}
        rooms={[]}
        errors={{}}
        onSubmit={() => {}}
      />
    </div>
  );
}
