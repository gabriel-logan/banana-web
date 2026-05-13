import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiCoffee, FiFileText, FiMessageSquare } from "react-icons/fi";

import type { Branch } from "../../types/branch.types";
import type { CreateReservationRequest } from "../../types/reservation.types";
import type { Room } from "../../types/room.types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

interface ReservationFormProps {
  branches: Branch[];
  rooms: Room[];
  values: CreateReservationRequest;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isEditing: boolean;
  onChange: (
    field: keyof CreateReservationRequest,
    value: string | number | boolean | null,
  ) => void;
  onSubmit: (e: FormEvent) => void;
}

export function ReservationForm({
  branches,
  rooms,
  values,
  errors,
  isSubmitting,
  isEditing,
  onChange,
  onSubmit,
}: ReservationFormProps) {
  const { t } = useTranslation();

  return (
    <form className="grid gap-6" onSubmit={onSubmit}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Select
          error={errors.branchId}
          hint={t("Choose the branch where the meeting will happen.")}
          label={t("Branch")}
          name="branchId"
          onChange={(e) => onChange("branchId", Number(e.target.value) || null)}
          options={branches.map((branch) => ({
            value: branch.id,
            label: branch.name,
          }))}
          value={values.branchId || ""}
        />
        <Select
          disabled={!values.branchId}
          error={errors.roomId}
          hint={
            values.branchId
              ? t("{{count}} room(s) available in this branch", {
                  count: rooms.length,
                })
              : t("Select a branch first")
          }
          label={t("Room")}
          name="roomId"
          onChange={(e) => onChange("roomId", Number(e.target.value) || null)}
          options={rooms.map((room) => ({ value: room.id, label: room.name }))}
          value={values.roomId || ""}
        />
        <Input
          error={errors.startTime}
          hint={t("Pick the exact start date and time.")}
          label={t("Start time")}
          name="startTime"
          onChange={(e) => onChange("startTime", e.target.value)}
          type="datetime-local"
          value={values.startTime}
        />
        <Input
          error={errors.endTime}
          hint={t("The end time must be after the start time.")}
          label={t("End time")}
          name="endTime"
          onChange={(e) => onChange("endTime", e.target.value)}
          type="datetime-local"
          value={values.endTime}
        />
      </div>

      <Input
        error={errors.responsible}
        hint={t("Main owner of this reservation.")}
        label={t("Responsible")}
        name="responsible"
        onChange={(e) => onChange("responsible", e.target.value)}
        placeholder={t("Who will host the meeting?")}
        value={values.responsible}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <label className="flex items-center gap-3 rounded-2xl border border-[var(--banana-stroke)] bg-white/80 px-4 py-3 text-sm font-medium text-slate-700">
          <input
            checked={values.coffee}
            className="h-4 w-4 rounded border-[var(--banana-stroke)] text-[var(--banana-amber)]"
            name="coffee"
            onChange={(e) => onChange("coffee", e.target.checked)}
            type="checkbox"
          />
          <FiCoffee className="text-[var(--banana-amber)]" />
          {t("Include coffee service")}
        </label>
        <Input
          disabled={!values.coffee}
          error={errors.peopleQuantity}
          hint={t("Required only when coffee service is enabled.")}
          label={t("People quantity")}
          min={1}
          name="peopleQuantity"
          onChange={(e) =>
            onChange(
              "peopleQuantity",
              e.target.value ? Number(e.target.value) : null,
            )
          }
          type="number"
          value={values.peopleQuantity ?? ""}
        />
      </div>

      <Input
        hint={t("Optional note about the meeting.")}
        label={t("Description")}
        name="description"
        onChange={(e) => onChange("description", e.target.value)}
        placeholder={t("Sprint review, board meeting, client presentation...")}
        value={values.description ?? ""}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          className="min-w-40"
          disabled={isSubmitting}
          type="submit"
          variant="secondary"
        >
          {isEditing ? <FiFileText /> : <FiMessageSquare />}
          {isSubmitting
            ? t("Saving...")
            : isEditing
              ? t("Update reservation")
              : t("Create reservation")}
        </Button>
      </div>
    </form>
  );
}
