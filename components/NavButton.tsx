import { Button } from "components/index.ts";
import { JSX } from "preact";

export function NavButton(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <Button
      {...props}
      class="rounded border-2 border-white text-white hover:bg-primaryLight hover:!border-primaryLight"
    />
  );
}
