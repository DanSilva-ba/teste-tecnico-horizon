import { HttpException, HttpStatus } from '@nestjs/common';

export class AppointmentNotFound extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        error: 'AppointmentNotFound',
        message: `Agendamento inexistente`,
      },
      HttpStatus.NOT_FOUND,
    );
    this.name = 'AppointmentNotFound';
  }
}