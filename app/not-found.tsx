// Fallback tecnico: con il matcher del middleware, ogni percorso reale finisce
// sotto /it o /en prima di arrivare qui — questo file copre solo i casi limite
// in cui Next.js risolve un not-found fuori dal segmento [locale]. Stili inline
// perché, non essendoci un app/layout.tsx superiore, qui non arriva globals.css.
export default function RootNotFound() {
    return (
        <html lang="it">
            <body style={{ margin: 0 }}>
                <main
                    style={{
                        minHeight: "100vh",
                        background: "#000",
                        color: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        padding: "1rem",
                        fontFamily: "system-ui, sans-serif",
                    }}
                >
                    <div style={{ fontSize: "6rem", fontWeight: 900, fontStyle: "italic" }}>404</div>
                    <p style={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", margin: "1rem 0 2rem" }}>
                        Pagina non trovata
                    </p>
                    <a
                        href="/"
                        style={{
                            padding: "0.75rem 1.5rem",
                            background: "#fff",
                            color: "#000",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            borderRadius: "9999px",
                            textDecoration: "none",
                        }}
                    >
                        Torna alla Home
                    </a>
                </main>
            </body>
        </html>
    );
}
