import { FiEdit, FiTrash2 } from "react-icons/fi";

import type { Reservation } from "../../types/reservation.types";
import { formatDate } from "../../utils/formatDate";
import { Button } from "../ui/Button";
import { Table } from "../ui/Table";

interface ReservationTableProps {
  reservations: Reservation[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ReservationTable({
  reservations,
  onEdit,
  onDelete,
}: ReservationTableProps) {
  const columns = [
    { key: "id", header: "ID" },
    { key: "branchName", header: "Branch" },
    { key: "roomName", header: "Room" },
    { key: "startTime", header: "Start" },
    { key: "endTime", header: "End" },
    { key: "responsible", header: "Responsible" },
    { key: "description", header: "Description" },
    { key: "actions", header: "Actions" },
  ];

  const data = reservations.map((r) => ({
    id: String(r.id),
    branchName: r.branchName,
    roomName: r.roomName,
    startTime: formatDate(r.startTime),
    endTime: formatDate(r.endTime),
    responsible: r.responsible,
    description: r.description ?? "-",
    actions: (
      <div className="flex gap-2">
        <Button onClick={() => onEdit(r.id)} variant="ghost">
          <FiEdit />
        </Button>
        <Button onClick={() => onDelete(r.id)} variant="ghost">
          <FiTrash2 />
        </Button>
      </div>
    ),
  }));

  return <Table columns={columns} data={data} />;
}
