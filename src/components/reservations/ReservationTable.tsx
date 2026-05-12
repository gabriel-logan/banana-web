import { FiEdit, FiTrash2 } from "react-icons/fi";

import type { Reservation } from "../../types/reservation.types";
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
    startTime: new Date(r.startTime).toLocaleString("pt-BR"),
    endTime: new Date(r.endTime).toLocaleString("pt-BR"),
    responsible: r.responsible,
    description: r.description ?? "-",
    actions: (
      <>
        <Button onClick={() => onEdit(r.id)}>
          <FiEdit />
        </Button>
        <Button onClick={() => onDelete(r.id)}>
          <FiTrash2 />
        </Button>
      </>
    ),
  }));

  return <Table columns={columns} data={data} />;
}
