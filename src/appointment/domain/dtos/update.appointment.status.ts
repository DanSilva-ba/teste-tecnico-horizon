import { IsIn, IsInt } from 'class-validator';

export class UpdateAppointmentStatus {
  @IsInt({ message: 'O id deve ser um número inteiro.' })
  id: number;

  @IsIn(['REALIZADA', 'CANCELADA'], { message: 'O status deve ser REALIZADA ou CANCELADA.' })
  status: 'REALIZADA' | 'CANCELADA';
}