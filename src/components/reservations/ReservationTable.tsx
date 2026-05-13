import { useTranslation } from "react-i18next";
import { FiEdit, FiMapPin, FiTrash2 } from "react-icons/fi";

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
  const { t } = useTranslation();
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
              ? t("Deselect all reservations")
              : t("Select all reservations")
          }
          checked={allSelected}
          className="h-4 w-4 rounded border-[var(--banana-stroke)] text-[var(--banana-amber)]"
          onChange={onToggleAll}
          type="checkbox"
        />
      ),
    },
    { key: "id", header: t("ID") },
    { key: "branchName", header: t("Branch") },
    { key: "roomName", header: t("Room") },
    { key: "startTime", header: t("Start") },
    { key: "endTime", header: t("End") },
    { key: "responsible", header: t("Responsible") },
    { key: "description", header: t("Description") },
    { key: "actions", header: t("Actions") },
  ];

  const data = reservations.map((reservation) => ({
    selection: (
      <input
        aria-label={t("Select reservation {{reservationId}}", {
          reservationId: reservation.id,
        })}
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

  return (
    <>
      <div className="hidden md:block">
        <Table columns={columns} data={data} />
      </div>

      <div className="grid gap-4 md:hidden">
        {reservations.map((reservation) => {
          const isSelected = selectedReservationIds.includes(reservation.id);

          return (
            <article
              key={reservation.id}
              className={`rounded-[24px] border bg-white/85 p-4 shadow-[0_18px_40px_rgba(148,163,184,0.12)] transition ${
                isSelected
                  ? "border-amber-300 ring-2 ring-amber-100"
                  : "border-[var(--banana-stroke)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <label className="flex min-w-0 items-start gap-3">
                  <input
                    aria-label={t("Select reservation {{reservationId}}", {
                      reservationId: reservation.id,
                    })}
                    checked={isSelected}
                    className="mt-1 h-4 w-4 rounded border-[var(--banana-stroke)] text-[var(--banana-amber)]"
                    onChange={() => onToggleSelection(reservation.id)}
                    type="checkbox"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                      {t("ID")}
                    </p>
                    <p className="text-base font-semibold text-slate-900">
                      #{reservation.id}
                    </p>
                  </div>
                </label>
                <div className="flex shrink-0 gap-2">
                  <Button
                    onClick={() => onEdit(reservation.id)}
                    variant="ghost"
                  >
                    <FiEdit />
                  </Button>
                  <Button
                    onClick={() => onDelete(reservation.id)}
                    variant="ghost"
                  >
                    <FiTrash2 />
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-amber-50/70 px-3 py-2 text-sm text-slate-700">
                <FiMapPin className="shrink-0 text-[var(--banana-amber)]" />
                <span className="min-w-0 truncate">
                  {reservation.branchName} • {reservation.roomName}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-3 py-3">
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                    {t("Start")}
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    {formatDate(reservation.startTime)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-3">
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                    {t("End")}
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    {formatDate(reservation.endTime)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-3">
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                    {t("Responsible")}
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    {reservation.responsible}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-3">
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                    {t("Description")}
                  </p>
                  <p className="mt-1 text-sm text-slate-800">
                    {reservation.description ?? "-"}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
