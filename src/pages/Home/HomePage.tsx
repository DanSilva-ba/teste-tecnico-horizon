import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AppointmentFormComponent, { type FormMode } from "../../components/appointmentFormComponent/appointmentFormComponent";
import AppointmentItemComponent from "../../components/appointmentItemComponent/appointmentItemComponent";
import ButtonComponent from "../../components/buttonComponent/buttonComponent";
import ConfirmDialogComponent from "../../components/confirmDialogComponent/confirmDialogComponent";
import FilterComponent from "../../components/filterComponent/filterComponent";
import HeaderComponent from "../../components/headerComponent/headerComponent";
import PaginationComponent from "../../components/paginationComponent/paginationComponent";
import ToastComponent from "../../components/toastComponent/toastComponent";
import { useAppointments } from "../../hooks/useAppointments";
import { useToast } from "../../hooks/useToast";
import {
    EMPTY_FILTERS,
    type Appointment,
    type AppointmentFilters,
    type AppointmentFormValues,
} from "../../models/appointment";
import { appointmentService } from "../../service/appointmentService";
import { getErrorMessages } from "../../service/http";
import { formatDay, formatTime } from "../../utils/date";
import style from "./home.module.css";

interface FormState {
    mode: FormMode;
    appointment?: Appointment;
}

export default function HomePage() {
    const [status, setStatus] = useState(EMPTY_FILTERS.status);
    const [search, setSearch] = useState(EMPTY_FILTERS.search);
    const [date, setDate] = useState(EMPTY_FILTERS.date);
    const [page, setPage] = useState(1);

    const filters = useMemo<AppointmentFilters>(() => ({ status, search, date }), [status, search, date]);
    const { data, loading, error, reload } = useAppointments(filters, page);

    const [form, setForm] = useState<FormState | null>(null);
    const [toDelete, setToDelete] = useState<Appointment | null>(null);
    const [busyId, setBusyId] = useState<number | null>(null);
    const { toast, showToast } = useToast();
    const [highlightId, setHighlightId] = useState<number | null>(null);
    const highlightTimer = useRef<number | undefined>(undefined);
    useEffect(() => () => window.clearTimeout(highlightTimer.current), []);

    const hasFilters = status !== "ALL" || search.trim() !== "" || date !== "";
    const items = data?.data ?? [];

    const handleFiltersChange = useCallback((next: AppointmentFilters) => {
        setStatus(next.status);
        setSearch(next.search);
        setDate(next.date);
        setPage(1);
    }, []);

    async function handleFormSubmit(values: AppointmentFormValues) {
        const mode = form?.mode ?? "create";
        const target = form?.appointment;
        let saved: Appointment;
        if (mode === "edit" && target) saved = await appointmentService.update(target.id, values);
        else if (mode === "reschedule" && target)
            saved = await appointmentService.reschedule(target.id, values.appointmentDate);
        else saved = await appointmentService.create(values);

        const when = `${formatDay(saved.appointmentDate)} às ${formatTime(saved.appointmentDate)}`;
        const messages = {
            create: `Consulta agendada para ${when}.`,
            edit: "Consulta atualizada.",
            reschedule: `Consulta remarcada para ${when}.`,
        };
        showToast(messages[mode]);
        setForm(null);
        await showAppointment(saved.id);
    }

    async function showAppointment(id: number) {
        const targetPage = await appointmentService.pageOf(id, filters).catch(() => null);
        if (targetPage && targetPage !== page) setPage(targetPage);
        else reload();
        setHighlightId(id);
        window.clearTimeout(highlightTimer.current);
        highlightTimer.current = window.setTimeout(() => setHighlightId(null), 4000);
    }

    async function runAction(a: Appointment, action: () => Promise<unknown>, successMessage: string) {
        setBusyId(a.id);
        try {
            await action();
            showToast(successMessage);
        } catch (e) {
            showToast(getErrorMessages(e).join(" "), "error");
        } finally {
            setBusyId(null);
            reload();
        }
    }

    async function handleDelete() {
        if (!toDelete) return;
        await appointmentService.remove(toDelete.id);
        // Se a página ficou vazia, volta para a anterior.
        if (items.length === 1 && page > 1) setPage(page - 1);
        setToDelete(null);
        showToast("Consulta excluída.");
        reload();
    }

    return (
    <>
        <HeaderComponent onNewAppointment={() => setForm({ mode: "create" })}/>

        <main className={style.container}>
            <div className={style.box__title}>
                <div className={style.yellow__line}></div>
                <div className={style.box__texts}>
                    <h1>Consultas</h1>
                    <p>Agende, acompanhe e atualize o status das consultas da clínica.</p>
                </div>
            </div>

            <FilterComponent filters={filters} onChange={handleFiltersChange}/>

            <section
                className={`${style.box__list__appointments} ${loading && data ? style.loading : ""}`}
                aria-busy={loading}
            >
                {error ? (
                    <div className={style.empty} role="alert">
                        <strong>Não foi possível carregar as consultas</strong>
                        <p>{error}</p>
                        <ButtonComponent variant="primary" onClick={reload}>Tentar novamente</ButtonComponent>
                    </div>
                ) : !data ? (
                    <div className={style.empty} role="status">Carregando consultas…</div>
                ) : items.length === 0 ? (
                    <div className={style.empty}>
                        <strong>Nenhuma consulta encontrada</strong>
                        <p>
                            {hasFilters
                                ? "Ajuste os filtros ou a busca para ver outras consultas."
                                : "Clique em “Nova consulta” para agendar a primeira."}
                        </p>
                        {hasFilters && (
                            <ButtonComponent onClick={() => handleFiltersChange(EMPTY_FILTERS)}>
                                Limpar filtros
                            </ButtonComponent>
                        )}
                    </div>
                ) : (
                    <ul className={style.list}>
                        {items.map((a) => (
                            <AppointmentItemComponent
                                key={a.id}
                                appointment={a}
                                busy={busyId === a.id}
                                highlighted={highlightId === a.id}
                                onEdit={(x) => setForm({ mode: "edit", appointment: x })}
                                onReschedule={(x) => setForm({ mode: "reschedule", appointment: x })}
                                onComplete={(x) => runAction(x, () => appointmentService.complete(x.id), "Consulta marcada como realizada.")}
                                onCancel={(x) => runAction(x, () => appointmentService.cancel(x.id), "Consulta cancelada.")}
                                onDelete={setToDelete}
                            />
                        ))}
                    </ul>
                )}

                {data && <PaginationComponent meta={data.meta} disabled={loading} onPageChange={setPage}/>}
            </section>
        </main>

        {form && (
            <AppointmentFormComponent
                mode={form.mode}
                appointment={form.appointment}
                onSubmit={handleFormSubmit}
                onClose={() => setForm(null)}
            />
        )}

        {toDelete && (
            <ConfirmDialogComponent
                title="Excluir consulta"
                message={`Excluir a consulta de ${toDelete.patientName}? Essa ação é definitiva e não pode ser desfeita.`}
                confirmLabel="Excluir consulta"
                onConfirm={handleDelete}
                onClose={() => setToDelete(null)}
            />
        )}

        <ToastComponent toast={toast}/>
    </>
 )
}
