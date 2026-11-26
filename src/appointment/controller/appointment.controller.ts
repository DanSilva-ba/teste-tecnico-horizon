import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import type { ScheduleAppointmentDTO } from '../domain/dtos/appointment.js';
import { AppointmentServiceAbs } from '../domain/services/appointment.service.abs.js';



@Controller('appointment')
export class AppointmentController {
    
    constructor(private schuduledAppointmentService: AppointmentServiceAbs){}

    @Post('scheduleAppointment')
    async scheduleAppointment(@Body() body: ScheduleAppointmentDTO){
        return await this.schuduledAppointmentService.scheduleAppointment(body);
    }

    @Get('findAllAppointmens')
    async findAllAppointmens() {
         return await this.schuduledAppointmentService.findAllAppointment();
    }

    @Delete(':id')
    async deleteAppointmentById(@Param('id', ParseIntPipe) id: number){
         return await this.schuduledAppointmentService.deleteAppointmentById(id.valueOf());
    }
}
