import { Injectable } from "@nestjs/common";
import { AppointmentServiceAbs } from "../../domain/services/appointment.service.abs.js";
import { ScheduleAppointmentDTO } from "../../domain/dtos/appointment.js";
import { AppointmentRepositoryAbs } from "../../domain/repository/appointment.repository.js";
import { AppointmentMapper } from "../mapper/appointment.mapper.js";
import { AppointmentResponseDTO } from "../../domain/dtos/appointment.response.dto.js";

@Injectable()
export class AppointmentServiceImpl implements AppointmentServiceAbs{

    constructor(private appointmentRepository: AppointmentRepositoryAbs, private appointmentMapper: AppointmentMapper){}
    updateApointmentById(param: ScheduleAppointmentDTO): Promise<AppointmentResponseDTO> {
        throw new Error("Method not implemented.");
    }
    
    async deleteAppointmentById(id: number): Promise<AppointmentResponseDTO> {
        return await this.appointmentMapper.toResponse(await this.appointmentRepository.deleteById(id));
    }

    async findAllAppointment(): Promise<AppointmentResponseDTO[]> {
        return await this.appointmentMapper.toResponseList(await this.appointmentRepository.findAll())
    }
    
    async scheduleAppointment(param: ScheduleAppointmentDTO): Promise<AppointmentResponseDTO> {
        return await this.appointmentMapper.toResponse(await this.appointmentRepository.create(this.appointmentMapper.toDomain(param)));
    }
}