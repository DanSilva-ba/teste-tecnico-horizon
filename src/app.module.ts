import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointment/appointment.module.js';
import { PrismaService } from './prisma/prisma.service.js';



@Module({
  imports: [AppointmentModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
