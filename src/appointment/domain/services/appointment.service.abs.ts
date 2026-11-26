import { ScheduleAppointmentDTO } from "../dtos/appointment.js";
import { AppointmentResponseDTO } from "../dtos/appointment.response.js";
import { RescheduleAppointment } from "../dtos/reschedule.appointment.js";
import { UpdateAppointment } from "../dtos/update.appointment.js";
import { UpdateAppointmentStatus } from "../dtos/update.appointment.status.js";

///// abstração do service, camada que irá entrar em contato com o repositório para a coletado de dados do banco;
export abstract class AppointmentServiceAbs {
    abstract scheduleAppointment(param: ScheduleAppointmentDTO) : Promise<AppointmentResponseDTO>;
    abstract findAllAppointment() : Promise<AppointmentResponseDTO[]>;
    abstract deleteAppointmentById(id: number): Promise<AppointmentResponseDTO>;
    abstract updateAppointmentById(param: UpdateAppointment) : Promise<AppointmentResponseDTO>; 
    abstract updateAppointmentStatus(param: UpdateAppointmentStatus) : Promise<AppointmentResponseDTO>
    abstract rescheduleAppointment(param: RescheduleAppointment): Promise<AppointmentResponseDTO>
}