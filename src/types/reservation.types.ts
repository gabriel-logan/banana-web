export interface Reservation {
  id: number
  branchId: number
  branchName: string
  roomId: number
  roomName: string
  startTime: string
  endTime: string
  responsible: string
  coffee: boolean
  peopleQuantity: number | null
  description: string | null
  createdAt: string
}

export interface CreateReservationRequest {
  branchId: number
  roomId: number
  startTime: string
  endTime: string
  responsible: string
  coffee: boolean
  peopleQuantity: number | null
  description: string | null
}

export interface UpdateReservationRequest extends CreateReservationRequest {
  id: number
}
