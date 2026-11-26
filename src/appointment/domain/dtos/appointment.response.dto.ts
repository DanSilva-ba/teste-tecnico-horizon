import { AppointmentStatus } from "../../../generated/prisma/client.js";

export interface AppointmentResponseDTO {
  id: number;
  patientName: string;
  patientCpf: string;
  appointmentDate: string;      
  specialty: string;
  observations: string | null;
  status: AppointmentStatus;
  createdAt: string;            
  updatedAt: string;            
}