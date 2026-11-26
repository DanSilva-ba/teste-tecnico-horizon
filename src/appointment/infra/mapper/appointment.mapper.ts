import { Injectable } from "@nestjs/common";
import { Appointment, AppointmentStatus } from "../../../generated/prisma/client.js";
import { ScheduleAppointmentDTO } from "../../domain/dtos/appointment.js";
import { AppointmentResponseDTO } from "../../domain/dtos/appointment.response.js";


type NewAppointment = Omit<Appointment, "id" | "createdAt" | "updatedAt">;

@Injectable()
export class AppointmentMapper {
  toDomain(dto: ScheduleAppointmentDTO): NewAppointment {
    return {
      patientName: dto.patientName.trim(),
      patientCpf: dto.patientCpf.replace(/\D/g, ""),
      appointmentDate: new Date(dto.appointmentDateAndTime),
      specialty: dto.specialty,
      notes: dto.observations ?? null,
      status: AppointmentStatus.AGENDADA,
    };
  }

  toResponse(entity: Appointment): AppointmentResponseDTO {
    return {
      id: entity.id,
      patientName: entity.patientName,
      patientCpf: entity.patientCpf,
      appointmentDate: entity.appointmentDate.toISOString(),
      specialty: entity.specialty,
      observations: entity.notes,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  toResponseList(entity: Appointment[]): AppointmentResponseDTO[] {
    let appointmentResponseListDto: AppointmentResponseDTO[] = []

    entity.map((value) => {
      appointmentResponseListDto.push(
        { id: value.id,
          patientName: value.patientName,
          patientCpf: value.patientCpf,
          appointmentDate: value.appointmentDate.toISOString(),
          specialty: value.specialty,
          observations: value.notes,
          status: value.status,
          createdAt: value.createdAt.toISOString(),
          updatedAt: value.updatedAt.toISOString()
        })
    })

    return appointmentResponseListDto;
  }
}