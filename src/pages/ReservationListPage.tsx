import { Button } from "../components/ui/Button"
import { ReservationTable } from "../components/reservations/ReservationTable"
import { FiPlus } from "react-icons/fi"

export function ReservationListPage() {
  return (
    <div>
      <div>
        <h1>Reservations</h1>
        <Button><FiPlus /> New Reservation</Button>
      </div>
      <ReservationTable
        reservations={[]}
        onEdit={(_id) => {}}
        onDelete={(_id) => {}}
      />
    </div>
  )
}
