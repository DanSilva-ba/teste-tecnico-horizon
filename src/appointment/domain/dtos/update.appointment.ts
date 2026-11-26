import { AppointmentStatus } from "../../../generated/prisma/enums.js";

export interface UpdateAppointment {
    id: number;
    patientName: string;
    patientCpf: string;
    appointmentDateAndTime: Date;
    specialty: string; 
    observations: string;
    status: AppointmentStatus; 
    createdAt: Date;
    updatedAt: Date;
}