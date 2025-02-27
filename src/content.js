function readOverrides() {
  const clone = (obj) => cloneInto(obj, window, { cloneFunctions: true });

  const singleSpaDevtools = window.wrappedJSObject.__SINGLE_SPA_DEVTOOLS__;
  const importMapOverrides = window.wrappedJSObject.importMapOverrides;
  if (!singleSpaDevtools || !importMapOverrides) {
    return [];
  }

  const rawAppData = clone(singleSpaDevtools.exposedMethods.getRawAppData());
  const overrideMap = clone(importMapOverrides.getOverrideMap(true));

  return rawAppData.map(({ name }) => {
    const value = overrideMap.imports[name] ?? "";
    const active = !value || !importMapOverrides.isDisabled(name);
    return { name, value, active };
  });
}

function saveOverride(o) {
  const importMapOverrides = window.wrappedJSObject.importMapOverrides;

  importMapOverrides.removeOverride(o.name);
  if (o.value) {
    importMapOverrides.addOverride(o.name, o.value);

    if (!o.active) {
      importMapOverrides.disableOverride(o.name);
    }
  }
}

if (!browser.runtime.onMessage.hasListener(saveOverride)) {
  browser.runtime.onMessage.addListener(saveOverride);
}

// "Install" the single-spa devtools.
// single-spa itself checks on startup whether this value exists,
// and if it does, only then does it actually insert the tools into the object.
if (!window.__SINGLE_SPA_OVERRIDES__) {
  Object.defineProperty(window, "__SINGLE_SPA_DEVTOOLS__", { value: {} });
}

Object.assign(window, { readOverrides });
