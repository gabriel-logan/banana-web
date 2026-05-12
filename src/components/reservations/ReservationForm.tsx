import type { FormEvent } from "react"
import { Input } from "../ui/Input"
import { Select } from "../ui/Select"
import { Button } from "../ui/Button"
import type { Branch } from "../../types/branch.types"
import type { Room } from "../../types/room.types"

interface ReservationFormProps {
  branches: Branch[]
  rooms: Room[]
  errors: Record<string, string>
  onSubmit: (e: FormEvent) => void
}

export function ReservationForm({ branches, rooms, errors, onSubmit }: ReservationFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Select
        label="Branch"
        name="branchId"
        options={branches.map((b) => ({ value: b.id, label: b.name }))}
        error={errors.branchId}
      />
      <Select
        label="Room"
        name="roomId"
        options={rooms.map((r) => ({ value: r.id, label: r.name }))}
        error={errors.roomId}
      />
      <Input label="Start Time" name="startTime" type="datetime-local" error={errors.startTime} />
      <Input label="End Time" name="endTime" type="datetime-local" error={errors.endTime} />
      <Input label="Responsible" name="responsible" error={errors.responsible} />
      <label>
        <input type="checkbox" name="coffee" />
        Coffee
      </label>
      <Input label="People Quantity" name="peopleQuantity" type="number" error={errors.peopleQuantity} />
      <Input label="Description" name="description" />
      <Button type="submit">Save</Button>
    </form>
  )
}
