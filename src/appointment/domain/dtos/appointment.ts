import { AppointmentStatus } from "../../../generated/prisma/enums.js";

export interface ScheduleAppointmentDTO {
    patientName: string;
    patientCpf: string;
    appointmentDateAndTime: Date;
    specialty: string; /// TODO: criar um enum de especialidades
    observations: string;
    status: AppointmentStatus; /// TODO: criar um enum de status
    createdAt: Date;
    updatedAt: Date;
}