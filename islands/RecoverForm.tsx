import { FormButton, Input } from "components/index.ts";

export enum RecoverMode {
  Set = "set",
  Reset = "reset",
}

type Props = {
  mode: RecoverMode;
};

export default function RecoverForm({ mode }: Props) {
  const reset = mode === RecoverMode.Reset;

  const [action, buttonText] = reset
    ? ["/api/recover", "Reset Password"]
    : ["/api/update-password", "Set New Password"];

  return (
    <div class="items-stretch min-w-0">
      <div class="flex justify-center">
        <h2 class="my-4">Reset Password</h2>
      </div>

      <form
        action={action}
        method="post"
        class="flex flex-col space-y-4 min-w-0"
      >
        {reset
          ? <Input autofocus type="email" name="email" />
          : <Input autofocus type="password" name="password" />}

        <FormButton type="submit" class="!mt-8">
          {buttonText}
        </FormButton>
      </form>
    </div>
  );
}
