import { IS_BROWSER } from "$fresh/runtime.ts";
import { JSX } from "preact";

export function Button(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={`inline-block cursor-pointer px-4 py-2 rounded border-2 border-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        props.class ?? ""
      }`}
    />
  );
}
