import { FiPlus } from "react-icons/fi";

import { ReservationTable } from "../components/reservations/ReservationTable";
import { Button } from "../components/ui/Button";

export function ReservationListPage() {
  return (
    <div>
      <div>
        <h1>Reservations</h1>
        <Button>
          <FiPlus /> New Reservation
        </Button>
      </div>
      <ReservationTable
        reservations={[]}
        onEdit={(_id) => {}}
        onDelete={(_id) => {}}
      />
    </div>
  );
}
