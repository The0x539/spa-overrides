async function readOverrides() {
  try {
    const [overrides] = await browser.tabs.executeScript({ code: "readOverrides()" });
    return overrides ?? [];
  } catch (e) {
    console.log('Failed to read single-spa import map overrides:', e);
    return [];
  }
}

async function getActiveTabId() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0].id;
}

async function saveOverride(override) {
  override.value = override.value.trim();
  const id = await getActiveTabId();
  await browser.tabs.sendMessage(id, Alpine.raw(override));
}
