import { ReservationForm } from "../components/reservations/ReservationForm"
import { Button } from "../components/ui/Button"
import { FiArrowLeft } from "react-icons/fi"

export function ReservationFormPage() {
  return (
    <div>
      <div>
        <Button><FiArrowLeft /> Back</Button>
        <h1>New Reservation</h1>
      </div>
      <ReservationForm
        branches={[]}
        rooms={[]}
        errors={{}}
        onSubmit={() => {}}
      />
    </div>
  )
}
