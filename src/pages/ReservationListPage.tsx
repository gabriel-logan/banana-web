import { useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheckSquare,
  FiFolderPlus,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { DeleteReservationModal } from "../components/reservations/DeleteReservationModal";
import { ReservationTable } from "../components/reservations/ReservationTable";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import {
  useDeleteReservation,
  useDeleteReservations,
  useReservations,
} from "../hooks/useReservations";
import { parseApiError } from "../utils/handleApiError";

export function ReservationListPage() {
  const navigate = useNavigate();
  const {
    data: reservations = [],
    isLoading,
    isError,
    error,
  } = useReservations();
  const deleteReservation = useDeleteReservation();
  const deleteReservations = useDeleteReservations();
  const [reservationToDelete, setReservationToDelete] = useState<number | null>(
    null,
  );
  const [selectedReservationIds, setSelectedReservationIds] = useState<
    number[]
  >([]);
  const [pageError, setPageError] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const activeSelectedReservationIds = useMemo(
    () =>
      selectedReservationIds.filter((reservationId) =>
        reservations.some((reservation) => reservation.id === reservationId),
      ),
    [reservations, selectedReservationIds],
  );

  async function confirmDelete() {
    if (reservationToDelete === null) {
      return;
    }

    try {
      setPageError(null);
      await deleteReservation.mutateAsync(reservationToDelete);
      toast.success("Reservation deleted.");
      setReservationToDelete(null);
    } catch (mutationError) {
      setPageError(parseApiError(mutationError).message);
    }
  }

  async function confirmBulkDelete() {
    if (activeSelectedReservationIds.length === 0) {
      return;
    }

    try {
      setPageError(null);
      await deleteReservations.mutateAsync(activeSelectedReservationIds);
      toast.success(
        `${activeSelectedReservationIds.length} reservation(s) deleted.`,
      );
      setSelectedReservationIds([]);
      setBulkDeleteOpen(false);
    } catch (mutationError) {
      setPageError(parseApiError(mutationError).message);
    }
  }

  function toggleReservationSelection(reservationId: number) {
    setSelectedReservationIds((current) =>
      current.includes(reservationId)
        ? current.filter((id) => id !== reservationId)
        : [...current, reservationId],
    );
  }

  function toggleAllReservations() {
    setSelectedReservationIds((current) =>
      current.length === reservations.length
        ? []
        : reservations.map((reservation) => reservation.id),
    );
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
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              disabled={activeSelectedReservationIds.length === 0}
              onClick={() => setBulkDeleteOpen(true)}
              variant="danger"
            >
              <FiTrash2 />
              Delete selected
            </Button>
            <Button
              onClick={() => navigate("/reservations/new")}
              variant="secondary"
            >
              <FiPlus />
              New reservation
            </Button>
          </div>
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
          <Alert title="Unable to load reservations">
            {parseApiError(error).message}
          </Alert>
        ) : reservations.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-[var(--banana-stroke)] bg-white/65 p-10 text-center shadow-[0_24px_60px_rgba(148,163,184,0.08)]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-2xl text-[var(--banana-amber)]">
              <FiCalendar />
            </div>
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
                <FiFolderPlus />
                Create first reservation
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {pageError && (
              <Alert title="Unable to delete reservation">{pageError}</Alert>
            )}
            <div className="flex flex-col gap-3 rounded-[24px] border border-[var(--banana-stroke)] bg-white/75 px-5 py-4 shadow-[0_20px_45px_rgba(148,163,184,0.1)] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-[var(--banana-amber)]">
                  <FiCheckSquare />
                </div>
                <span>
                  {activeSelectedReservationIds.length === 0
                    ? "Select reservations to delete them in batch."
                    : `${activeSelectedReservationIds.length} reservation(s) selected.`}
                </span>
              </div>
              {activeSelectedReservationIds.length > 0 && (
                <Button
                  onClick={() => setSelectedReservationIds([])}
                  variant="ghost"
                >
                  Clear selection
                </Button>
              )}
            </div>
            <ReservationTable
              onDelete={(id) => setReservationToDelete(id)}
              onEdit={(id) => navigate(`/reservations/${id}/edit`)}
              onToggleAll={toggleAllReservations}
              onToggleSelection={toggleReservationSelection}
              reservations={reservations}
              selectedReservationIds={activeSelectedReservationIds}
            />
          </div>
        )}
      </section>

      <DeleteReservationModal
        count={1}
        onClose={() => setReservationToDelete(null)}
        onConfirm={confirmDelete}
        open={reservationToDelete !== null}
      />
      <DeleteReservationModal
        count={activeSelectedReservationIds.length}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={confirmBulkDelete}
        open={bulkDeleteOpen}
      />
    </>
  );
}
