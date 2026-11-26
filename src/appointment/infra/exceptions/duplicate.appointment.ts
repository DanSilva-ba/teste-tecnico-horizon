import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateAppointmentException extends HttpException {
  constructor(
    public readonly cpf: string,
    public readonly date: Date,
  ) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        error: 'DuplicateAppointment',
        message: `Não será possível agendar essa consulta: o CPF ${cpf} já possui uma consulta agendada para ${date}`,
      },
      HttpStatus.CONFLICT,
    );
    this.name = 'DuplicateAppointmentException';
  }
}