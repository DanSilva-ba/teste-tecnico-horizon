import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import type { ScheduleAppointmentDTO } from '../domain/dtos/appointment.js';
import { AppointmentServiceAbs } from '../domain/services/appointment.service.abs.js';
import type { UpdateAppointmentStatus } from '../domain/dtos/update.appointment.status.js';



@Controller('appointment')
export class AppointmentController {
    
    constructor(private schuduledAppointmentService: AppointmentServiceAbs){}

    @Post()
    async scheduleAppointment(@Body() body: ScheduleAppointmentDTO){
        return await this.schuduledAppointmentService.scheduleAppointment(body);
    }

    @Get()
    async findAllAppointmens() {
         return await this.schuduledAppointmentService.findAllAppointment();
    }

    @Delete(':id')
    async deleteAppointmentById(@Param('id', ParseIntPipe) id: number){
         return await this.schuduledAppointmentService.deleteAppointmentById(id.valueOf());
    }

    @Put()
    async updateAppointmentStatus(@Body() param: UpdateAppointmentStatus){
         return await this.schuduledAppointmentService.updateAppointmentStatus(param);
    }
}
