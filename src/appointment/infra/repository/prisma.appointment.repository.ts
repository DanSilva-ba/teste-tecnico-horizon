import { Injectable } from "@nestjs/common";
import { Appointment } from "../../../generated/prisma/client.js";
import { AppointmentCreateInput } from "../../../generated/prisma/models.js";
import { AppointmentRepositoryAbs } from "../../domain/repository/appointment.repository.js";
import { PrismaService } from "../../../prisma/prisma.service.js";

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepositoryAbs {

    constructor(private prismaService: PrismaService){}

    create(data: AppointmentCreateInput): Promise<Appointment> {
        return this.prismaService.appointment.create({data});
    }

    findAll(): Promise<Appointment[]> {
        return this.prismaService.appointment.findMany();
    }
    
    update(): Promise<Appointment> {
        console.log("chegou no repositorio")
        throw new Error("Method not implemented.");
    }

    deleteById(id: number): Promise<Appointment> {
        return this.prismaService.appointment.delete({where: {
            id: id
        }})
    }  
}