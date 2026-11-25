import { Module } from '@nestjs/common';
import { AppointmentModule } from './appointment/appointment.module.js';


@Module({
  imports: [AppointmentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
