import { useTranslation } from "react-i18next";
import { FiAlertTriangle } from "react-icons/fi";

import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

interface DeleteReservationModalProps {
  open: boolean;
  count?: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteReservationModal({
  open,
  count = 1,
  onClose,
  onConfirm,
}: DeleteReservationModalProps) {
  const { t } = useTranslation();
  const isBulkDelete = count > 1;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <FiAlertTriangle className="text-2xl" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">
            {isBulkDelete
              ? t("Delete selected reservations")
              : t("Delete reservation")}
          </h3>
          <p className="text-sm leading-6 text-slate-600">
            {isBulkDelete
              ? t(
                  "This action cannot be undone. The {{count}} selected reservations will be permanently removed.",
                  { count },
                )
              : t(
                  "This action cannot be undone. The selected reservation will be permanently removed.",
                )}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button onClick={onClose} variant="ghost">
            {t("Cancel")}
          </Button>
          <Button onClick={onConfirm} variant="danger">
            {t("Confirm delete")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
