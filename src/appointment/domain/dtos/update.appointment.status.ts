import { AppointmentStatus } from "../../../generated/prisma/enums.js";

export interface UpdateAppointmentStatus {
    id: number;
    status: AppointmentStatus;
}