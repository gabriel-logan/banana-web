import i18next from "i18next";
import validator from "multiform-validator";

export function validateReservation(data: {
  branchId: number | null;
  roomId: number | null;
  startTime: string;
  endTime: string;
  responsible: string;
  coffee: boolean;
  peopleQuantity: number | null;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  const trimmedResponsible = data.responsible.trim();
  const hasStartTime = !validator.isEmpty(data.startTime);
  const hasEndTime = !validator.isEmpty(data.endTime);
  const startDate = hasStartTime ? new Date(data.startTime) : null;
  const endDate = hasEndTime ? new Date(data.endTime) : null;

  if (data.branchId === null || validator.isEmpty(String(data.branchId))) {
    errors.branchId = i18next.t("Branch is required");
  }

  if (data.roomId === null || validator.isEmpty(String(data.roomId))) {
    errors.roomId = i18next.t("Room is required");
  }

  if (!hasStartTime) errors.startTime = i18next.t("Start time is required");
  else if (Number.isNaN(startDate?.getTime())) {
    errors.startTime = i18next.t("Enter a valid start time");
  }

  if (!hasEndTime) errors.endTime = i18next.t("End time is required");
  else if (Number.isNaN(endDate?.getTime())) {
    errors.endTime = i18next.t("Enter a valid end time");
  }

  if (validator.isEmpty(trimmedResponsible)) {
    errors.responsible = i18next.t("Responsible is required");
  } else if (trimmedResponsible.length > 255) {
    errors.responsible = i18next.t(
      "Responsible must be 255 characters or fewer",
    );
  }

  if (data.coffee) {
    if (
      data.peopleQuantity === null ||
      validator.isEmpty(String(data.peopleQuantity))
    ) {
      errors.peopleQuantity = i18next.t(
        "People quantity is required when coffee is selected",
      );
    } else if (
      !Number.isInteger(data.peopleQuantity) ||
      data.peopleQuantity <= 0
    ) {
      errors.peopleQuantity = i18next.t(
        "People quantity must be greater than zero",
      );
    }
  }

  if (startDate && endDate && startDate >= endDate) {
    errors.endTime = i18next.t("End time must be after start time");
  }

  return errors;
}
