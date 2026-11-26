import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';

const BY_CODE: Record<string, { status: number; error: string; message: string }> = {
  P2000: { status: HttpStatus.BAD_REQUEST, error: 'ValueTooLong', message: 'Um dos campos excede o tamanho máximo permitido.' },
  P2002: { status: HttpStatus.CONFLICT, error: 'Conflict', message: 'Já existe um registro com esses dados.' },
  P2025: { status: HttpStatus.NOT_FOUND, error: 'AppointmentNotFound', message: 'Agendamento inexistente' },
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const mapped = BY_CODE[exception.code];

    if (!mapped) {
      console.error(exception);
      return res.status(500).json({ statusCode: 500, error: 'InternalServerError', message: 'Erro interno do servidor.' });
    }

    res.status(mapped.status).json({ statusCode: mapped.status, error: mapped.error, message: mapped.message });
  }
}