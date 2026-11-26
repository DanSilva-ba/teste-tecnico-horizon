import { HttpException, HttpStatus } from '@nestjs/common';
import { formatDate } from '../../../utils/date/date.js';

export class DuplicateAppointmentException extends HttpException {
  constructor(
    public readonly cpf: string,
    public readonly date: Date,
  ) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        error: 'DuplicateAppointment',
        message: `Não será possível agendar essa consulta: o CPF ${cpf} já possui uma consulta agendada para ${formatDate(date)}`,
      },
      HttpStatus.CONFLICT,
    );
    this.name = 'DuplicateAppointmentException';
  }
}