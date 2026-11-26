-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('AGENDADA', 'REALIZADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "patientName" VARCHAR(150) NOT NULL,
    "patientCpf" CHAR(11) NOT NULL,
    "appointmentDate" TIMESTAMPTZ(6) NOT NULL,
    "specialty" VARCHAR(255) NOT NULL,
    "notes" TEXT,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'AGENDADA',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);
