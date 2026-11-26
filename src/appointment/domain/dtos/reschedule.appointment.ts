import { IsInt, IsISO8601 } from 'class-validator';

export class RescheduleAppointment {
  @IsInt({ message: 'O id deve ser um número inteiro.' })
  id: number;

  @IsISO8601({}, { message: 'A data deve estar no formato ISO 8601.' })
  date: string;
}