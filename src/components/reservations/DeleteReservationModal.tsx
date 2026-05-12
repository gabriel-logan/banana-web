import { Modal } from "../ui/Modal"
import { Button } from "../ui/Button"
import { FiAlertTriangle } from "react-icons/fi"

interface DeleteReservationModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteReservationModal({ open, onClose, onConfirm }: DeleteReservationModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <FiAlertTriangle />
      <h3>Delete Reservation</h3>
      <p>Are you sure you want to delete this reservation?</p>
      <Button onClick={onConfirm}>Confirm</Button>
      <Button onClick={onClose}>Cancel</Button>
    </Modal>
  )
}
