import { type FormEvent, useMemo, useState } from "react";
import { FiArrowLeft, FiCalendar, FiEdit3 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import { ReservationForm } from "../components/reservations/ReservationForm";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { useBranches } from "../hooks/useBranches";
import {
  useCreateReservation,
  useReservation,
  useUpdateReservation,
} from "../hooks/useReservations";
import { useRooms } from "../hooks/useRooms";
import type { Branch } from "../types/branch.types";
import type {
  CreateReservationRequest,
  Reservation,
} from "../types/reservation.types";
import { parseApiError } from "../utils/handleApiError";
import { validateReservation } from "../validators/reservation.validator";

const emptyForm: CreateReservationRequest = {
  branchId: 0,
  roomId: 0,
  startTime: "",
  endTime: "",
  responsible: "",
  coffee: false,
  peopleQuantity: null,
  description: null,
};

function toDatetimeLocal(value: string) {
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toFormValues(
  reservation?: Reservation,
): CreateReservationRequest | undefined {
  if (!reservation) {
    return undefined;
  }

  return {
    branchId: reservation.branchId,
    roomId: reservation.roomId,
    startTime: toDatetimeLocal(reservation.startTime),
    endTime: toDatetimeLocal(reservation.endTime),
    responsible: reservation.responsible,
    coffee: reservation.coffee,
    peopleQuantity: reservation.peopleQuantity,
    description: reservation.description,
  };
}

interface ReservationEditorProps {
  branches: Branch[];
  id?: string;
  initialValues: CreateReservationRequest;
  isEditing: boolean;
}

function ReservationEditor({
  branches,
  id,
  initialValues,
  isEditing,
}: ReservationEditorProps) {
  const navigate = useNavigate();
  const [values, setValues] = useState<CreateReservationRequest>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const selectedBranchId = values.branchId || undefined;
  const { data: rooms = [], isLoading: roomsLoading } =
    useRooms(selectedBranchId);
  const createReservation = useCreateReservation();
  const updateReservation = useUpdateReservation();

  function handleChange(
    field: keyof CreateReservationRequest,
    value: string | number | boolean | null,
  ) {
    setValues((current) => {
      const next = { ...current, [field]: value };

      if (field === "branchId") {
        next.roomId = 0;
      }

      if (field === "coffee" && value === false) {
        next.peopleQuantity = null;
      }

      if (field === "description" && value === "") {
        next.description = null;
      }

      return next;
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors = validateReservation({
      ...values,
      branchId: values.branchId || null,
      roomId: values.roomId || null,
    });
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload: CreateReservationRequest = {
      ...values,
      description: values.description?.trim() || null,
      responsible: values.responsible.trim(),
    };

    try {
      if (isEditing && id) {
        await updateReservation.mutateAsync({
          id: Number(id),
          data: { ...payload, id: Number(id) },
        });
        toast.success("Reservation updated.");
      } else {
        await createReservation.mutateAsync(payload);
        toast.success("Reservation created.");
      }

      navigate("/reservations");
    } catch (error) {
      const parsedError = parseApiError(error);
      setSubmitError(parsedError.message);
      setErrors((current) => ({ ...current, ...parsedError.fieldErrors }));
    }
  }

  const isSubmitting =
    createReservation.isPending || updateReservation.isPending;

  return (
    <>
      {submitError && (
        <Alert title="Unable to save reservation">{submitError}</Alert>
      )}
      <ReservationForm
        branches={branches}
        errors={errors}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
        rooms={rooms}
        values={values}
      />
      {selectedBranchId && !roomsLoading && rooms.length === 0 && (
        <p className="mt-4 text-sm text-amber-700">
          No rooms are available for the selected branch yet.
        </p>
      )}
    </>
  );
}

export function ReservationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { data: branches = [], isLoading: branchesLoading } = useBranches();
  const { data: reservation, isLoading: reservationLoading } = useReservation(
    id ?? "",
  );

  const initialValues = useMemo(
    () => toFormValues(reservation) ?? emptyForm,
    [reservation],
  );
  const pageTitle = isEditing ? "Edit reservation" : "New reservation";
  const isLoading = branchesLoading || (isEditing && reservationLoading);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[30px] border border-white/60 bg-white/70 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Button onClick={() => navigate("/reservations")} variant="ghost">
            <FiArrowLeft />
            Back to list
          </Button>
          <div>
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--banana-gold)] text-2xl text-slate-900 shadow-[0_16px_35px_rgba(247,201,72,0.3)]">
              {isEditing ? <FiEdit3 /> : <FiCalendar />}
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              {pageTitle}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Choose the branch, room, time range, and meeting owner before
              saving the reservation.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-white/60 bg-white/85 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:p-8">
        {isLoading ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        ) : (
          <ReservationEditor
            branches={branches}
            id={id}
            initialValues={initialValues}
            isEditing={isEditing}
            key={id ?? "new"}
          />
        )}
      </div>
    </section>
  );
}
