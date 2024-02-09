import { IS_BROWSER } from "$fresh/runtime.ts";
import { JSX } from "preact";

export function Input(props: JSX.HTMLAttributes<HTMLInputElement>) {
  const name = props.name?.toString() || "";
  const displayName = name.charAt(0).toLocaleUpperCase() + name.slice(1);

  return (
    <label for={props.name} class="flex flex-col flex-grow font-bold mb-1">
      {displayName}
      <input
        {...props}
        disabled={!IS_BROWSER || props.disabled}
        class={`px-3 py-2 bg-white rounded border-2 border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          props.class ?? ""
        }`}
      />
    </label>
  );
}
