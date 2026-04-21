/**
 * Evita repetir la intro al navegar (p. ej. galería → home) sin recargar la página.
 * Se resetea en cada recarga completa del bundle.
 */
export const splashSession = {
  introDismissedThisLoad: false,
};
