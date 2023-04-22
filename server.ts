import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

router.get("/static/:filename", async (context) => {
  const { filename } = context.params;
  if (filename) {
    await send(context, filename, {
      root: `${Deno.cwd()}/static`,
      index: "index.html",
    });
  }
});

// Read index.html
async function readIndexHtml() {
  const decoder = new TextDecoder("utf-8");
  const data = await Deno.readFile("./index.html");
  return decoder.decode(data);
}

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
  ctx.response.headers.set("Content-Type", "text/html");
  ctx.response.body = await readIndexHtml();
});

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });