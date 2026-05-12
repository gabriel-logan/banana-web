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

  if (data.branchId === null || validator.isEmpty(String(data.branchId))) {
    errors.branchId = "Branch is required";
  }

  if (data.roomId === null || validator.isEmpty(String(data.roomId))) {
    errors.roomId = "Room is required";
  }

  if (validator.isEmpty(data.startTime))
    errors.startTime = "Start time is required";
  if (validator.isEmpty(data.endTime)) errors.endTime = "End time is required";
  if (validator.isEmpty(data.responsible))
    errors.responsible = "Responsible is required";

  if (data.coffee) {
    if (
      data.peopleQuantity === null ||
      validator.isEmpty(String(data.peopleQuantity))
    ) {
      errors.peopleQuantity =
        "People quantity is required when coffee is selected";
    }
  }

  if (
    data.startTime &&
    data.endTime &&
    new Date(data.startTime) >= new Date(data.endTime)
  ) {
    errors.endTime = "End time must be after start time";
  }

  return errors;
}
