# Supa Fresh PKCE

An example app using Deno's [Fresh](https://fresh.deno.dev/) framework and
[Supabase](https://supabase.com/) implementing the PKCE authentication scheme.

## 🚧 This is a work in progress! 🚧

[Here's an article]() I wrote about building this.

Consider leaving me a star!

[![Github Repo Stars](https://img.shields.io/github/stars/morlinbrot/supa-fresh-pkce?style=social)](https://github.com/morlinbrot/supa-fresh-pkce)

## Usage

You need a [Supabase account](https://supabase.com/) which you can create for free. Create a `.env` file in the project root containing the following variables:
```
SUPABASE_URL=https://<projectName>.supabase.co
SUPABASE_ANON_KEY=<api_key>
```

Run the app:

```
deno task start
```

This will watch the project directory and restart as necessary.
