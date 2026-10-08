import { useState, type FormEvent } from "react";
import { ApiError, subscribeToWaitlist } from "../lib/api.ts";
import styles from "./WaitlistPage.module.css";

type Status = "idle" | "loading" | "success" | "error";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const isLoading = status === "loading";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    setStatus("loading");
    setMessage("");

    try {
      const data = await subscribeToWaitlist(email);

      setStatus("success");
      setMessage(
        data.alreadySubscribed
          ? "Ya estabas en la lista. Te avisaremos igual."
          : "¡Listo! Te avisaremos cuando abramos el acceso.",
      );
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Algo salió mal. Inténtalo de nuevo.",
      );
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />

      <section className={styles.card}>
        <header className={styles.header}>
          <span className={styles.badge}>Cloudflare Workers · Platzi</span>
          <h1 className={styles.title}>Waitly</h1>
          <p className={styles.subtitle}>
            La lista de espera que construimos paso a paso en el curso de
            Cloudflare Workers de Platzi. Déjanos tu email y sé de los primeros
            en entrar.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.label} htmlFor="email">
            Tu email
          </label>

          <div className={styles.row}>
            <input
              id="email"
              className={styles.input}
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                // Un nuevo intento limpia el resultado del anterior.
                if (status !== "idle") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              autoComplete="email"
              required
              disabled={isLoading}
              aria-describedby={message ? "form-message" : undefined}
              aria-invalid={status === "error"}
            />

            <button className={styles.button} type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Enviando
                </>
              ) : (
                "Unirme"
              )}
            </button>
          </div>

          {message && (
            <p
              id="form-message"
              role="status"
              aria-live="polite"
              className={`${styles.message} ${
                status === "success" ? styles.messageSuccess : styles.messageError
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <p className={styles.footnote}>
          Sin spam. Sólo un correo cuando Waitly esté disponible.
        </p>
      </section>
    </main>
  );
}
