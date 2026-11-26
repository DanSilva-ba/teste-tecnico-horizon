import { Injectable } from "@nestjs/common";
import { Appointment } from "../../../generated/prisma/client.js";
import { AppointmentCreateInput } from "../../../generated/prisma/models.js";
import { AppointmentRepositoryAbs } from "../../domain/repository/appointment.repository.js";
import { PrismaService } from "../../../prisma/prisma.service.js";
import { UpdateAppointmentStatus } from "../../domain/dtos/update.appointment.status.js";
import { AppointmentNotFound } from "../exceptions/not.found.js";
import { UpdateAppointment } from "../../domain/dtos/update.appointment.js";
import { RescheduleAppointment } from "../../domain/dtos/reschedule.appointment.js";

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepositoryAbs {

    constructor(private prismaService: PrismaService){}

    async rescheduleAppointment(param: RescheduleAppointment): Promise<Appointment> {
        return this.prismaService.appointment.update({
            where: { id: param.id },
            data: { appointmentDate: new Date(param.date) },
        });
    }


    async updateAppointmentById(param: UpdateAppointment): Promise<Appointment> {
        return this.prismaService.appointment.update({
            where: { id: param.id },
            data: {
            patientName: param.patientName,
            patientCpf: param.patientCpf?.replace(/\D/g, ''),
            appointmentDate: param.appointmentDateAndTime ? new Date(param.appointmentDateAndTime) : undefined,
            specialty: param.specialty,
            notes: param.observations,
            },
        });
    }

    async findById(id: number): Promise<Appointment> {
        const response = await this.prismaService.appointment.findFirst({where: {id}})

        if(!response) {
            throw new AppointmentNotFound();
        }

        return response;
    }

    async updateAppointmentStatus(param: UpdateAppointmentStatus): Promise<Appointment> {
        const response = await this.prismaService.appointment.update({where: {id: param.id}, data: {status: param.status}});

        if(!response) {
            throw new AppointmentNotFound();
        }

        return response;
    }

    async findAppointmentByPatientCpfAndAppointmentDate(data: AppointmentCreateInput): Promise<Appointment | null> {
        const response = await this.prismaService.appointment.findFirst({where: {patientCpf: data.patientCpf, appointmentDate: data.appointmentDate}});
        return response;
    }

    async create(data: AppointmentCreateInput): Promise<Appointment> {
        return await this.prismaService.appointment.create({data});
    }

    async findAll(): Promise<Appointment[]> {
        return await this.prismaService.appointment.findMany();
    }
    
    async deleteById(id: number): Promise<Appointment> {
        return await this.prismaService.appointment.delete({where: {
            id: id
        }})
    }

    
}