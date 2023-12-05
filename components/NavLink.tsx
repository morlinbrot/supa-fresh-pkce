import { Link } from "components/index.ts";
import { JSX } from "preact";

export function NavLink(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      {...props}
      class="!text-gray-800 px-4 hover:!text-white hover:no-underline"
    />
  );
}
