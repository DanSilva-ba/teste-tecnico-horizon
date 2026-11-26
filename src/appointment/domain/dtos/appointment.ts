import { Transform } from 'class-transformer';
import { IsISO8601, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export const CPF_REGEX = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

export class ScheduleAppointmentDTO {
  @Transform(trim)
  @IsString({ message: 'O nome deve ser um texto.' })
  @Length(3, 150, { message: 'O nome deve ter entre 3 e 150 caracteres.' })
  patientName: string;

  @IsString({ message: 'O CPF deve ser um texto.' })
  @Matches(CPF_REGEX, { message: 'CPF inválido. Use o formato 000.000.000-00.' })
  patientCpf: string;

  @IsNotEmpty({ message: 'Informe a data e a hora da consulta.' })
  @IsISO8601({}, { message: 'A data deve estar no formato ISO 8601.' })
  appointmentDateAndTime: Date;

  @Transform(trim)
  @IsString({ message: 'A especialidade deve ser um texto.' })
  @Length(3, 100, { message: 'A especialidade deve ter entre 3 e 100 caracteres.' })
  specialty: string;

  @IsOptional()
  @Transform(trim)
  @IsString({ message: 'As observações devem ser um texto.' })
  @MaxLength(1000, { message: 'As observações devem ter no máximo 1.000 caracteres.' })
  observations?: string | null;
}