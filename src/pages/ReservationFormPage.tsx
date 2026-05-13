import { type FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

const reservationFieldDependencies: Record<
  keyof CreateReservationRequest,
  (keyof CreateReservationRequest)[]
> = {
  branchId: ["branchId", "roomId"],
  roomId: ["roomId"],
  startTime: ["startTime", "endTime"],
  endTime: ["startTime", "endTime"],
  responsible: ["responsible"],
  coffee: ["coffee", "peopleQuantity"],
  peopleQuantity: ["peopleQuantity"],
  description: [],
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
  id?: string;
  initialValues: CreateReservationRequest;
  isEditing: boolean;
}

function ReservationEditor({
  id,
  initialValues,
  isEditing,
}: ReservationEditorProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [values, setValues] = useState<CreateReservationRequest>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const selectedBranchId = values.branchId || undefined;
  const ignoreReservationId = isEditing && id ? Number(id) : undefined;
  const hasValidTimeRange =
    Boolean(values.startTime) &&
    Boolean(values.endTime) &&
    new Date(values.startTime) < new Date(values.endTime);
  const { data: branches = [], isLoading: branchesLoading } = useBranches(
    hasValidTimeRange ? values.startTime : undefined,
    hasValidTimeRange ? values.endTime : undefined,
    ignoreReservationId,
  );
  const { data: rooms = [], isLoading: roomsLoading } = useRooms(
    selectedBranchId,
    hasValidTimeRange ? values.startTime : undefined,
    hasValidTimeRange ? values.endTime : undefined,
    ignoreReservationId,
  );
  const createReservation = useCreateReservation();
  const updateReservation = useUpdateReservation();
  const branchIsAvailable =
    !values.branchId ||
    branches.some((branch) => branch.id === values.branchId);
  const roomIsAvailable =
    !values.roomId || rooms.some((room) => room.id === values.roomId);

  function handleChange(
    field: keyof CreateReservationRequest,
    value: string | number | boolean | null,
  ) {
    setSubmitError(null);
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

      const nextErrors = validateReservation({
        ...next,
        branchId: next.branchId || null,
        roomId: next.roomId || null,
      });

      setErrors((currentErrors) => {
        const updated = { ...currentErrors };

        for (const dependentField of reservationFieldDependencies[field]) {
          if (nextErrors[dependentField]) {
            updated[dependentField] = nextErrors[dependentField];
          } else {
            delete updated[dependentField];
          }
        }

        return updated;
      });

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

    if (hasValidTimeRange && !branchIsAvailable) {
      nextErrors.branchId = t(
        "Select an available branch for the chosen time range",
      );
    }

    if (hasValidTimeRange && values.branchId && !roomIsAvailable) {
      nextErrors.roomId = t(
        "Select an available room for the chosen time range",
      );
    }

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
        toast.success(t("Reservation updated."));
      } else {
        await createReservation.mutateAsync(payload);
        toast.success(t("Reservation created."));
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
        <Alert title={t("Unable to save reservation")}>{submitError}</Alert>
      )}
      {hasValidTimeRange && !branchesLoading && branches.length === 0 && (
        <Alert title={t("No availability found")}>
          {t("No branches have rooms available for the selected time range.")}
        </Alert>
      )}
      {hasValidTimeRange && values.branchId && !branchIsAvailable && (
        <Alert title={t("Branch no longer available")}>
          {t(
            "The selected branch does not have any available rooms for the chosen time range.",
          )}
        </Alert>
      )}
      <ReservationForm
        branches={branches}
        errors={errors}
        isEditing={isEditing}
        isSubmitting={isSubmitting || branchesLoading}
        onChange={handleChange}
        onSubmit={handleSubmit}
        rooms={rooms}
        values={values}
      />
      {hasValidTimeRange &&
        selectedBranchId &&
        !roomsLoading &&
        roomIsAvailable &&
        rooms.length === 0 && (
          <p className="mt-4 text-sm text-amber-700">
            {t(
              "No rooms are available for the selected branch in the chosen time range.",
            )}
          </p>
        )}
      {hasValidTimeRange && values.roomId && !roomIsAvailable && (
        <p className="mt-4 text-sm text-amber-700">
          {t(
            "The selected room is no longer available for the chosen time range.",
          )}
        </p>
      )}
    </>
  );
}

export function ReservationFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { data: reservation, isLoading: reservationLoading } = useReservation(
    id ?? "",
  );

  const initialValues = useMemo(
    () => toFormValues(reservation) ?? emptyForm,
    [reservation],
  );
  const pageTitle = isEditing ? t("Edit reservation") : t("New reservation");
  const isLoading = isEditing && reservationLoading;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-[26px] border border-white/60 bg-white/70 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between sm:rounded-[30px] sm:p-6 sm:shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="space-y-3">
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate("/reservations")}
            variant="ghost"
          >
            <FiArrowLeft />
            {t("Back to list")}
          </Button>
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--banana-gold)] text-xl text-slate-900 shadow-[0_14px_28px_rgba(247,201,72,0.28)] sm:h-14 sm:w-14 sm:text-2xl sm:shadow-[0_16px_35px_rgba(247,201,72,0.3)]">
              {isEditing ? <FiEdit3 /> : <FiCalendar />}
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 sm:text-4xl">
              {pageTitle}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              {t(
                "Choose the branch, room, time range, and meeting owner before saving the reservation.",
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/60 bg-white/85 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.1)] sm:rounded-[32px] sm:p-8 sm:shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
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
