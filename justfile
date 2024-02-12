default:
	just -l -u

run:
	deno run --unstable-kv --allow-env --allow-read --allow-write --allow-run --allow-net --env --watch=static/,routes/ dev.ts

build:
	deno run -A --unstable-kv --env dev.ts build

check:
	deno fmt --check && deno lint && deno check **/*.ts  && deno check --unstable-kv **/*.tsx
