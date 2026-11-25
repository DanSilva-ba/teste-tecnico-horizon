import { Body, Controller, Post } from '@nestjs/common';
import type { ScheduleAppointmentDTO } from '../domain/dtos/appointment.js';


@Controller('appointment')
export class AppointmentController {

    @Post('scheduleAppointment')
    async scheduleAppointment(@Body() param: ScheduleAppointmentDTO) {
        
    }

}
