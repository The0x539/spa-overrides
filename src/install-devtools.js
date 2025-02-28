// "Install" the single-spa devtools.
// single-spa itself checks on startup whether this value exists,
// and if it does, only then does it actually insert the tools into the object.
if (!globalThis.__SINGLE_SPA_DEVTOOLS__) {
  Object.defineProperty(globalThis, "__SINGLE_SPA_DEVTOOLS__", { value: {} });
}
