import { Injectable } from "@nestjs/common";
import { AppointmentServiceAbs } from "../../domain/services/appointment.service.abs.js";
import { ScheduleAppointmentDTO } from "../../domain/dtos/appointment.js";
import { AppointmentRepositoryAbs } from "../../domain/repository/appointment.repository.js";
import { AppointmentMapper } from "../mapper/appointment.mapper.js";
import { AppointmentResponseDTO } from "../../domain/dtos/appointment.response.js";
import { DuplicateAppointmentException } from "../exceptions/duplicate.appointment.js";
import { RetroactiveDateException } from "../exceptions/retroative.date.js";
import { UpdateAppointmentStatus } from "../../domain/dtos/update.appointment.status.js";
import { isToday } from "../../../utils/date/date.js";
import { InvalidCompletionDateException } from "../exceptions/invalid.completion.date.exception.js";
import { AppointmentNotEditableException } from "../exceptions/appointment.not.editable.exception.js";
import { UpdateAppointment } from "../../domain/dtos/update.appointment.js";
import { RescheduleAppointment } from "../../domain/dtos/reschedule.appointment.js";

@Injectable()
export class AppointmentServiceImpl implements AppointmentServiceAbs{
    constructor(private appointmentRepository: AppointmentRepositoryAbs, private appointmentMapper: AppointmentMapper){}

    async rescheduleAppointment(param: RescheduleAppointment): Promise<AppointmentResponseDTO> {
        return this.appointmentMapper.toResponse(await this.appointmentRepository.rescheduleAppointment(param))
    }

    async updateAppointmentById(param: UpdateAppointment): Promise<AppointmentResponseDTO> {
        return this.appointmentMapper.toResponse(await this.appointmentRepository.updateAppointmentById(param));
    }

    ////// Atualiza o status do agendamento
    async updateAppointmentStatus(param: UpdateAppointmentStatus): Promise<AppointmentResponseDTO> {
        const appointment = await this.appointmentRepository.findById(param.id);
        if (appointment.status !== 'AGENDADA') throw new AppointmentNotEditableException(appointment.status);
        if (param.status === 'REALIZADA' && !isToday(appointment.appointmentDate)) {
            throw new InvalidCompletionDateException(appointment.appointmentDate);
        }
        const updated = await this.appointmentRepository.updateAppointmentStatus(param);
        return this.appointmentMapper.toResponse(updated)
    }

    async updateApointmentById(param: ScheduleAppointmentDTO): Promise<AppointmentResponseDTO> {
        throw new Error("Method not implemented.");
    }
    
    /////// Deleta o agendamento pelo ID
    async deleteAppointmentById(id: number): Promise<AppointmentResponseDTO> {
        return await this.appointmentMapper.toResponse(await this.appointmentRepository.deleteById(id));
    }

    /////// Busca todos os agendamentos
    async findAllAppointment(): Promise<AppointmentResponseDTO[]> {
        return this.appointmentMapper.toResponseList(await this.appointmentRepository.findAll())
    }

    ///////Realiza um novo agendamento
    async scheduleAppointment(param: ScheduleAppointmentDTO): Promise<AppointmentResponseDTO> {
        const responseDate = await this.appointmentRepository.findAppointmentByPatientCpfAndAppointmentDate(this.appointmentMapper.toDomain(param))
        //////// condição para evitar duplicidade de agendamento 
        if(responseDate){
                throw new DuplicateAppointmentException(responseDate.patientCpf, responseDate.appointmentDate);
        }
        //////// condição para verificar se a data de agendamento é retroativa
        if(param.appointmentDateAndTime < param.createdAt) {
            throw new RetroactiveDateException(param.appointmentDateAndTime, param.createdAt);
        }
        return await this.appointmentMapper.toResponse(await this.appointmentRepository.create(this.appointmentMapper.toDomain(param)));
    }
}