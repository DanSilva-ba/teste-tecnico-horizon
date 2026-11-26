import { Appointment, Prisma } from "../../../generated/prisma/client.js";
import { RescheduleAppointment } from "../dtos/reschedule.appointment.js";
import { UpdateAppointment } from "../dtos/update.appointment.js";
import { UpdateAppointmentStatus } from "../dtos/update.appointment.status.js";

///// abstração do repositorio, camada que mais baixa e irá entrar em contato com o banco diretamente;
export abstract class AppointmentRepositoryAbs {
    abstract create(data: Prisma.AppointmentCreateInput): Promise<Appointment>;
    abstract deleteById(id: Number): Promise<Appointment>;
    abstract findAll(): Promise<Appointment[]>;
    abstract findById(id: number): Promise<Appointment>;
    abstract findAppointmentByPatientCpfAndAppointmentDate(data: Prisma.AppointmentCreateInput): Promise<Appointment | null>;
    abstract updateAppointmentStatus(param: UpdateAppointmentStatus): Promise<Appointment>; 
    abstract updateAppointmentById(param: UpdateAppointment): Promise<Appointment>;
    abstract rescheduleAppointment(param: RescheduleAppointment) : Promise<Appointment>;
}