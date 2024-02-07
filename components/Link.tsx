import { IS_BROWSER } from "$fresh/runtime.ts";
import { JSX } from "preact";

export function Link(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={`text-primary hover:underline hover:text-primaryStrong ${
        props.class ?? ""
      }`}
    />
  );
}
