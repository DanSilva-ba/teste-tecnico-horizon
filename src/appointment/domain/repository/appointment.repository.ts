import { Appointment, Prisma } from "../../../generated/prisma/client.js";

///// abstração do repositorio, camada que mais baixa e irá entrar em contato com o banco diretamente;
export abstract class AppointmentRepositoryAbs {
    abstract create(data: Prisma.AppointmentCreateInput): Promise<Appointment>;
    abstract update(): Promise<Appointment>;
    abstract deleteById(id: Number): Promise<Appointment>;
    abstract findAll(): Promise<Appointment[]>;
}