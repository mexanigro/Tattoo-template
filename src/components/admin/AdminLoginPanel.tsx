import React from "react";
import { Scissors, AlertCircle } from "lucide-react";
import { getRedirectResult, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { siteConfig } from "../../config/site";
import {
  ADMIN_OAUTH_RETURN_KEY,
  createGoogleAuthProvider,
  firebaseAuthMessageEs,
} from "../../lib/google-auth";

type Props = {
  onExit: () => void;
};

function readFirebaseCode(err: unknown): string {
  if (err && typeof err === "object" && "code" in err && typeof (err as { code: unknown }).code === "string") {
    return (err as { code: string }).code;
  }
  return "";
}

export function AdminLoginPanel({ onExit }: Props) {
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /** Tras volver de signInWithRedirect, Firebase deja el resultado pendiente aquí. */
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await getRedirectResult(auth);
      } catch (err: unknown) {
        const code = readFirebaseCode(err);
        if (code && code !== "auth/redirect-cancelled-by-user" && alive) {
          console.error("[AdminLogin] getRedirectResult:", err);
          setError(firebaseAuthMessageEs(code));
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const runSignIn = async (mode: "popup" | "redirect") => {
    const provider = createGoogleAuthProvider();
    setBusy(true);
    setError(null);
    try {
      if (mode === "redirect") {
        try {
          sessionStorage.setItem(ADMIN_OAUTH_RETURN_KEY, "1");
        } catch {
          /* private mode / blocked */
        }
        await signInWithRedirect(auth, provider);
        return;
      }
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const code = readFirebaseCode(err);
      if (code === "auth/popup-closed-by-user") {
        setError(firebaseAuthMessageEs(code));
        console.warn("[AdminLogin] Popup closed / code:", code, err);
        return;
      }
      console.error("[AdminLogin] Sign-in failed:", err);
      setError(firebaseAuthMessageEs(code || "unknown"));
    } finally {
      setBusy(false);
    }
  };

  const configMissing = !siteConfig.adminEmail?.trim();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background transition-colors duration-300">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent-light border-t-transparent" />
        <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Comprobando sesión…
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 transition-colors duration-300">
      <div className="mb-8 flex h-20 w-20 rotate-3 items-center justify-center rounded-2xl bg-accent-light shadow-2xl shadow-accent-light/20">
        <Scissors className="text-zinc-950" size={40} />
      </div>

      {configMissing ? (
        <div className="mb-8 max-w-sm space-y-4 text-center">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <AlertCircle className="mx-auto mb-2 text-red-500" size={24} />
            <p className="text-xs font-black uppercase tracking-widest text-red-500">Configuration error</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Set <span className="font-mono text-foreground">adminEmail</span> in{" "}
              <span className="font-mono">site.ts</span> or <span className="font-mono">VITE_ADMIN_EMAIL</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={onExit}
            className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-accent-light"
          >
            Return to site
          </button>
        </div>
      ) : (
        <>
          <h2 className="mb-2 text-3xl font-black uppercase tracking-tighter text-foreground">
            Terminal <span className="text-accent-light">Access</span>
          </h2>
          <div className="mb-8 flex items-center justify-center gap-2">
            <div className="h-1 w-1 rounded-full bg-zinc-500" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground">
              Authorized personnel only
            </p>
            <div className="h-1 w-1 rounded-full bg-zinc-500" />
          </div>

          {error ? (
            <div className="mb-6 max-w-md space-y-2 text-left">
              <p className="text-sm leading-relaxed text-red-500">{error}</p>
              <p className="text-[10px] text-muted-foreground">
                Si sigue fallando: Firebase Console → Authentication → Sign-in method (Google activado) y Settings →
                Authorized domains (tu <span className="font-mono">localhost</span> o dominio).
              </p>
            </div>
          ) : null}

          <div className="flex w-full max-w-sm flex-col gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => void runSignIn("popup")}
              className="flex items-center justify-center gap-4 rounded-[20px] bg-card px-10 py-5 font-black uppercase tracking-widest text-card-foreground shadow-2xl transition-all active:scale-[0.98] disabled:opacity-60"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted">
                <img
                  src="https://www.google.com/favicon.ico"
                  className="h-3 w-3 grayscale"
                  alt=""
                />
              </div>
              <span className="text-[11px]">{busy ? "Abriendo…" : "Entrar con Google (ventana)"}</span>
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => void runSignIn("redirect")}
              className="rounded-2xl border border-border bg-muted/50 px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-foreground transition-colors hover:border-accent-light/50 hover:bg-muted disabled:opacity-60"
            >
              Entrar con Google (redirección)
              <span className="mt-1 block font-normal normal-case tracking-normal text-muted-foreground">
                Usa esta opción si la ventana se cierra sola o no puedes elegir cuenta.
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={onExit}
            className="mt-12 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Return to site
          </button>
        </>
      )}
    </div>
  );
}
