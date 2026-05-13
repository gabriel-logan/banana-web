import { FiEdit, FiTrash2 } from "react-icons/fi";

import type { Reservation } from "../../types/reservation.types";
import { formatDate } from "../../utils/formatDate";
import { Button } from "../ui/Button";
import { Table } from "../ui/Table";

interface ReservationTableProps {
  reservations: Reservation[];
  selectedReservationIds: number[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleSelection: (id: number) => void;
  onToggleAll: () => void;
}

export function ReservationTable({
  reservations,
  selectedReservationIds,
  onEdit,
  onDelete,
  onToggleSelection,
  onToggleAll,
}: ReservationTableProps) {
  const allSelected =
    reservations.length > 0 &&
    reservations.every((reservation) =>
      selectedReservationIds.includes(reservation.id),
    );

  const columns = [
    {
      key: "selection",
      header: (
        <input
          aria-label={
            allSelected
              ? "Deselect all reservations"
              : "Select all reservations"
          }
          checked={allSelected}
          className="h-4 w-4 rounded border-[var(--banana-stroke)] text-[var(--banana-amber)]"
          onChange={onToggleAll}
          type="checkbox"
        />
      ),
    },
    { key: "id", header: "ID" },
    { key: "branchName", header: "Branch" },
    { key: "roomName", header: "Room" },
    { key: "startTime", header: "Start" },
    { key: "endTime", header: "End" },
    { key: "responsible", header: "Responsible" },
    { key: "description", header: "Description" },
    { key: "actions", header: "Actions" },
  ];

  const data = reservations.map((reservation) => ({
    selection: (
      <input
        aria-label={`Select reservation ${reservation.id}`}
        checked={selectedReservationIds.includes(reservation.id)}
        className="h-4 w-4 rounded border-[var(--banana-stroke)] text-[var(--banana-amber)]"
        onChange={() => onToggleSelection(reservation.id)}
        type="checkbox"
      />
    ),
    id: String(reservation.id),
    branchName: reservation.branchName,
    roomName: reservation.roomName,
    startTime: formatDate(reservation.startTime),
    endTime: formatDate(reservation.endTime),
    responsible: reservation.responsible,
    description: reservation.description ?? "-",
    actions: (
      <div className="flex gap-2">
        <Button onClick={() => onEdit(reservation.id)} variant="ghost">
          <FiEdit />
        </Button>
        <Button onClick={() => onDelete(reservation.id)} variant="ghost">
          <FiTrash2 />
        </Button>
      </div>
    ),
  }));

  return <Table columns={columns} data={data} />;
}
