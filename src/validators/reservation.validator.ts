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
    errors.branchId = "Branch is required";
  }

  if (data.roomId === null || validator.isEmpty(String(data.roomId))) {
    errors.roomId = "Room is required";
  }

  if (!hasStartTime) errors.startTime = "Start time is required";
  else if (Number.isNaN(startDate?.getTime())) {
    errors.startTime = "Enter a valid start time";
  }

  if (!hasEndTime) errors.endTime = "End time is required";
  else if (Number.isNaN(endDate?.getTime())) {
    errors.endTime = "Enter a valid end time";
  }

  if (validator.isEmpty(trimmedResponsible)) {
    errors.responsible = "Responsible is required";
  } else if (trimmedResponsible.length > 255) {
    errors.responsible = "Responsible must be 255 characters or fewer";
  }

  if (data.coffee) {
    if (
      data.peopleQuantity === null ||
      validator.isEmpty(String(data.peopleQuantity))
    ) {
      errors.peopleQuantity =
        "People quantity is required when coffee is selected";
    } else if (
      !Number.isInteger(data.peopleQuantity) ||
      data.peopleQuantity <= 0
    ) {
      errors.peopleQuantity = "People quantity must be greater than zero";
    }
  }

  if (startDate && endDate && startDate >= endDate) {
    errors.endTime = "End time must be after start time";
  }

  return errors;
}
