import browser from "webextension-polyfill";

export async function readOverrides() {
  return await runInPage(readOverridesInjected);
}

export async function saveOverride(override) {
  await runInPage(saveOverrideInjected, override);
}

async function runInPage(func, ...args) {
  const [{ result }] = await browser.scripting.executeScript({
    target: { tabId: await getActiveTabId() },
    func,
    args,
    world: "MAIN",
  });
  return result;
}

async function getActiveTabId() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0].id;
}

function readOverridesInjected() {
  const ssd = globalThis.__SINGLE_SPA_DEVTOOLS__.exposedMethods;
  const imo = globalThis.importMapOverrides;

  if (!ssd || !imo) {
    return [];
  }

  const rawAppData = ssd.getRawAppData();
  const overrideMap = imo.getOverrideMap(true);

  return rawAppData.map(({ name }) => {
    const value = overrideMap.imports[name] ?? "";
    const active = value === "" || !imo.isDisabled(name);
    return { name, value, active };
  });
}

function saveOverrideInjected(o) {
  const imo = globalThis.importMapOverrides;

  imo.removeOverride(o.name);
  if (o.value) {
    imo.addOverride(o.name, o.value);
    if (!o.active) {
      imo.disableOverride(o.name);
    }
  }
}
