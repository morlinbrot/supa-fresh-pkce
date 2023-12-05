import { IS_BROWSER } from "$fresh/runtime.ts";
import { JSX } from "preact";

export function FormButton(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={`flex-grow inline-block cursor-pointer px-4 py-2 rounded border-2 border-gray-500 disabledopacity-50 disabled:cursor-not-allowed bg-primary border-primary text-white hover:bg-primaryStrong hover:border-primaryStrong ${
        props.class ?? ""
      }`}
    />
  );
}
