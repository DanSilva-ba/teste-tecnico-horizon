import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import type { ScheduleAppointmentDTO } from '../domain/dtos/appointment.js';
import { AppointmentServiceAbs } from '../domain/services/appointment.service.abs.js';
import type { UpdateAppointmentStatus } from '../domain/dtos/update.appointment.status.js';
import type { RescheduleAppointment } from '../domain/dtos/reschedule.appointment.js';
import { UpdateAppointment } from '../domain/dtos/update.appointment.js';



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

    @Put(':id')
     async updateAppointmentById(@Param('id', ParseIntPipe) id: number, @Body() body: Omit<UpdateAppointment, 'id'>,) {
     return await this.schuduledAppointmentService.updateAppointmentById({ ...body, id });
     }

    @Put()
    async updateAppointmentStatus(@Body() param: UpdateAppointmentStatus){
         return await this.schuduledAppointmentService.updateAppointmentStatus(param);
    }

    @Put('rescheduleAppointment')
    async rescheduleAppointment(@Body() param: RescheduleAppointment){
         return await this.schuduledAppointmentService.rescheduleAppointment(param);
    }


}
