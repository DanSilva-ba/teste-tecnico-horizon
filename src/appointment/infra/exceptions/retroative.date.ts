import { HttpException, HttpStatus } from '@nestjs/common';
import { formatDate } from '../../utils/date/date.js';

export class RetroactiveDateException extends HttpException {
  constructor(
    public readonly appointmentDate: Date,
    public readonly currentDate: Date = new Date(),
  ) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'RetroactiveDate',
        message: `Não será possível agendar essa consulta: a data ${formatDate(appointmentDate)} é anterior à data atual (${formatDate(currentDate)})`,
      },
      HttpStatus.UNPROCESSABLE_ENTITY, 
    );
    this.name = 'RetroactiveDateException';
  }
}