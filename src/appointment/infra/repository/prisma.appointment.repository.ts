import { Injectable } from "@nestjs/common";
import { Appointment } from "../../../generated/prisma/client.js";
import { AppointmentCreateInput } from "../../../generated/prisma/models.js";
import { AppointmentRepositoryAbs } from "../../domain/repository/appointment.repository.js";
import { PrismaService } from "../../../prisma/prisma.service.js";
import { UpdateAppointmentStatus } from "../../domain/dtos/update.appointment.status.js";
import { AppointmentNotFound } from "../../exceptions/not.found.js";

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepositoryAbs {

    constructor(private prismaService: PrismaService){}
    async findById(id: number): Promise<Appointment> {
        const response = await this.prismaService.appointment.findFirst({where: {id}})

        if(!response) {
            throw new AppointmentNotFound();
        }

        return response;
    }

    async updateAppointmentStatus(param: UpdateAppointmentStatus): Promise<Appointment> {
        return await this.prismaService.appointment.update({where: {id: param.id}, data: {status: param.status}})
    }

    async findAppointmentByPatientCpfAndAppointmentDate(data: AppointmentCreateInput): Promise<Appointment | null> {
        return this.prismaService.appointment.findFirst({where: {patientCpf: data.patientCpf, appointmentDate: data.appointmentDate,},});
    }

    async create(data: AppointmentCreateInput): Promise<Appointment> {
        return await this.prismaService.appointment.create({data});
    }

    async findAll(): Promise<Appointment[]> {
        return await this.prismaService.appointment.findMany();
    }
    
    update(): Promise<Appointment> {
        console.log("chegou no repositorio")
        throw new Error("Method not implemented.");
    }

    async deleteById(id: number): Promise<Appointment> {
        return await this.prismaService.appointment.delete({where: {
            id: id
        }})
    }

    
}