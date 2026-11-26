import { HttpException, HttpStatus } from "@nestjs/common";
import { formatDate } from "../../utils/date/date.js";


export class InvalidCompletionDateException extends HttpException {
  constructor(public readonly appointmentDate: Date) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'InvalidCompletionDate',
        message: `A consulta só pode ser marcada como REALIZADA no dia ${formatDate(appointmentDate)}`,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}