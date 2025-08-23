import { debounce } from "@std/async"

const F = (rel: string) => new URL(import.meta.resolve(rel)).pathname

const render = debounce((scriptPath: string) => {
	console.log("Rerender...")
	new Deno.Command("deno", {
		args: ["run", "-A", scriptPath],
		cwd: F("../"),
		stdin: "inherit",
		stderr: "inherit",
		stdout: "inherit",
	}).outputSync()
	console.log("Rerendered.")
}, 200)

for await (const event of Deno.watchFs(F("../examples"))) {
	if (event.kind !== "modify") continue
	render(event.paths.at(-1)!)
}
