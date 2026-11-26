import type { ScheduleAppointmentDTO } from "../dtos/appointment.js";
import { AppointmentResponseDTO } from "../dtos/appointment.response.dto.js";

export abstract class AppointmentServiceAbs {
    abstract scheduleAppointment(param: ScheduleAppointmentDTO) : Promise<AppointmentResponseDTO>;
    abstract findAllAppointment() : Promise<AppointmentResponseDTO[]>;
    abstract deleteAppointmentById(id: number): Promise<AppointmentResponseDTO>;
    abstract updateApointmentById(param: ScheduleAppointmentDTO) : Promise<AppointmentResponseDTO>; /// ajustar, pedir id tambem 
}