import { Module } from '@nestjs/common';
import { AppointmentController } from './controller/appointment.controller.js';
import { AppointmentServiceAbs } from './domain/services/appointment.service.abs.js';
import { AppointmentServiceImpl } from './infra/services/appointment.service.impl.js';
import { AppointmentRepositoryAbs } from './domain/repository/appointment.repository.js';
import { PrismaAppointmentRepository } from './infra/repository/prisma.appointment.repository.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AppointmentMapper } from './infra/mapper/appointment.mapper.js';


@Module({
    controllers: [AppointmentController],
    providers: [
        {
            provide: AppointmentServiceAbs,
            useClass: AppointmentServiceImpl
        },
        {
            provide: AppointmentRepositoryAbs,
            useClass: PrismaAppointmentRepository
        },
        PrismaService,
        AppointmentMapper
    ]
})
export class AppointmentModule {}