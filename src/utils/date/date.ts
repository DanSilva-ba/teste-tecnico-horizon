const TIMEZONE = 'America/Sao_Paulo';
const toDayKey = (date: Date) => date.toLocaleDateString('en-CA', { timeZone: TIMEZONE });
export const isToday = (date: Date) => toDayKey(date) === toDayKey(new Date());
export const formatDate = (date: Date) => date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });