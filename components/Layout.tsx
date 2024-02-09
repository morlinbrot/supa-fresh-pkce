import { ComponentChildren } from "preact";

import { NavButton, NavLink } from "components/index.ts";
import { ServerState } from "../types.ts";

type Props = {
  children: ComponentChildren;
  state: ServerState;
};

export function Layout(props: Props) {
  const isAllowed = !!props.state.user;

  const buttProps = isAllowed
    ? { href: "/api/sign-out", text: "Sign Out" }
    : { href: "/sign-in", text: "Sign In" };

  const message = props.state.message;

  return (
    <>
      <div class="bg-primary">
        <nav class="flex items-center justify-between flex-wrap min-h-[80px] max-w-screen-md mx-auto p-4">
          <a href="/">
            <div class="flex flex-shrink-0 border-white">
              <img
                src="/logo.svg"
                class="w-8 h-8"
                alt="the fresh logo: a sliced lemon dripping with juice"
              />
              <h1 class="ml-2 text-white">Supa Fresh PKCE</h1>
            </div>
          </a>

          <div class="flex flex-grow pt-1">
            <div class="flex flex-grow">
              <NavLink href="/secret">Secret</NavLink>
            </div>
            <div class="flex sm:flex-shrink-0">
              <NavLink href="/sign-up">Create account</NavLink>
              <NavButton href={buttProps.href}>{buttProps.text}</NavButton>
            </div>
          </div>
        </nav>
      </div>

      {message && (
        <div class="bg-primaryLight">
          <div class="mx-auto max-w-screen-md pl-4">
            <div class="flex flex-grow">
              <p class="text-white">
                <strong>{message.title}</strong> {message.text}
              </p>
            </div>
          </div>
        </div>
      )}

      <div class="mx-auto max-w-screen-md p-4">
        {props.children}
      </div>
    </>
  );
}
