// Il form admin salva la data evento come stringa "locale" senza fuso orario
// (input datetime-local, es. "2026-08-28T22:00"). Il server (Vercel, UTC) e il
// browser del visitatore la interpreterebbero in due fusi diversi se parsata
// con `new Date()` diretto. Questa funzione la interpreta sempre come ora di
// Roma (gestendo CET/CEST) e restituisce l'istante UTC corretto.
export function parseRomeLocalDate(naive: string): Date {
    const asUTC = new Date(`${naive}Z`);
    const romeOffsetMinutes = getRomeOffsetMinutes(asUTC);
    return new Date(asUTC.getTime() - romeOffsetMinutes * 60_000);
}

function getRomeOffsetMinutes(date: Date): number {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Rome",
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })
        .formatToParts(date)
        .reduce((acc, p) => {
            if (p.type !== "literal") acc[p.type] = p.value;
            return acc;
        }, {} as Record<string, string>);

    const asIfUTC = Date.UTC(
        Number(parts.year),
        Number(parts.month) - 1,
        Number(parts.day),
        Number(parts.hour),
        Number(parts.minute),
        Number(parts.second)
    );

    return (asIfUTC - date.getTime()) / 60_000;
}
