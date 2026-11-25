import { Module } from '@nestjs/common';
import { AppointmentController } from './controller/appointment.controller.js';

@Module({
    controllers: [AppointmentController]
})
export class AppointmentModule {}
