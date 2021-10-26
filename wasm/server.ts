import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use(async (context) => {
    await context.send({
        root: Deno.cwd(),
        index: "index.html",
    });
});

await app.listen({ port: 3000 });