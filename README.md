# Supa Fresh PKCE

An example app using Deno's [Fresh](https://fresh.deno.dev/) framework and
[Supabase](https://supabase.com/) implementing the PKCE authentication scheme.

## 🚧 This is a work in progress! 🚧

[Here's an article]() I wrote about building this.

If you like the app, consider leaving me a star!

[![Github Repo Stars](https://img.shields.io/github/stars/morlinbrot/supa-fresh-pkce?style=social)](https://github.com/morlinbrot/supa-fresh-pkce)

## Usage

You need a [Supabase account](https://supabase.com/) which you can create for free. Create a `.env` file in the project root containing the following variables:
```txt
SUPABASE_URL=https://<projectName>.supabase.co
SUPABASE_ANON_KEY=<api_key>
```

Run the app:

```shell
deno task start
```

This will watch the project directory and restart as necessary.

## Server Messages with Deno Kv

An interesting tidbit about this app is that it uses Deno Kv to "pass" messages from API endpoints to route handlers which is a good example for the usefulness and simplicity of Deno Kv. Since there is no (elegant) way of passing values through a redirect, we store a message in the kv store, attach its id as search parameter, parse the id in a middleware and then attach the message back into the `FreshContext`. This way, message value can be arbitrarily complex and may also contain sensitive information.
