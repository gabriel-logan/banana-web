import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { DeleteReservationModal } from "../components/reservations/DeleteReservationModal";
import { ReservationTable } from "../components/reservations/ReservationTable";
import { Button } from "../components/ui/Button";
import {
  useDeleteReservation,
  useReservations,
} from "../hooks/useReservations";
import { handleApiError } from "../utils/handleApiError";

export function ReservationListPage() {
  const navigate = useNavigate();
  const {
    data: reservations = [],
    isLoading,
    isError,
    error,
  } = useReservations();
  const deleteReservation = useDeleteReservation();
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(
    null,
  );

  async function confirmDelete() {
    if (reservationToDelete === null) {
      return;
    }

    try {
      await deleteReservation.mutateAsync(reservationToDelete);
      toast.success("Reservation deleted.");
      setReservationToDelete(null);
    } catch (mutationError) {
      toast.error(handleApiError(mutationError));
    }
  }

  return (
    <>
      <section className="space-y-8">
        <div className="flex flex-col gap-4 rounded-[30px] border border-white/60 bg-white/70 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-[var(--banana-leaf)] uppercase">
              Reservation hub
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Reservations
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Review scheduled meetings, edit bookings, and keep room
                allocation organized across every branch.
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/reservations/new")}
            variant="secondary"
          >
            <FiPlus />
            New reservation
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-[28px] border border-[var(--banana-stroke)] bg-white/70"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            {handleApiError(error)}
          </div>
        ) : reservations.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[var(--banana-stroke)] bg-white/65 p-10 text-center shadow-[0_24px_60px_rgba(148,163,184,0.08)]">
            <h2 className="text-xl font-semibold text-slate-900">
              No reservations yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
              Start by creating your first booking for a branch and room.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => navigate("/reservations/new")}
                variant="secondary"
              >
                <FiPlus />
                Create first reservation
              </Button>
            </div>
          </div>
        ) : (
          <ReservationTable
            onDelete={(id) => setReservationToDelete(id)}
            onEdit={(id) => navigate(`/reservations/${id}/edit`)}
            reservations={reservations}
          />
        )}
      </section>

      <DeleteReservationModal
        onClose={() => setReservationToDelete(null)}
        onConfirm={confirmDelete}
        open={reservationToDelete !== null}
      />
    </>
  );
}
