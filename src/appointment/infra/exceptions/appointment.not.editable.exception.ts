import { HttpException, HttpStatus } from "@nestjs/common";

export class AppointmentNotEditableException extends HttpException {
  constructor(status: string) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'AppointmentNotEditable',
        message: `Consultas com status ${status} não podem ser alteradas`,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}