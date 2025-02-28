import { readOverrides, saveOverride } from "./popup.js";

import { h, render } from "preact";
import { useComputed, useSignal } from "@preact/signals";
import htm from "htm";

const html = htm.bind(h);

const OverrideItem = (props) => {
  const overrideUrl = useSignal(props.value);
  const active = useSignal(props.active);

  const blank = useComputed(() => !overrideUrl.value.trim());

  const save = () => {
    saveOverride({
      name: props.name,
      value: overrideUrl.peek(),
      active: active.peek(),
    });
  };

  const onTextbox = (e) => {
    e.currentTarget.value = e.currentTarget.value.trim();
    overrideUrl.value = e.currentTarget.value;
  };

  const onCheckbox = (e) => {
    active.value = e.currentTarget.checked;
    save();
  };

  return html`
    <li>
      <label>${props.name}</label>
      <input
        type=text
        autocomplete=url
        defaultValue=${overrideUrl}
        onInput=${onTextbox}
        onChange=${save}
      />
      <input
        type=checkbox
        checked=${active}
        disabled=${blank}
        indeterminate=${blank}
        onChange=${onCheckbox}
      />
    </li>
  `;
};

export const Popup = (props) => {
  if (props.overrides.length === 0) {
    return html`<p>No microfrontends found.</p>`;
  }

  return html`
    <ul>
      ${props.overrides.map((o) => h(OverrideItem, o))}
    </ul>
  `;
};

const overrides = await readOverrides();
render(h(Popup, { overrides }), document.body);
