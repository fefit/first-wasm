import { serve } from "https://deno.land/std/http/server.ts";
import staticFiles from "https://deno.land/x/static_files@1.1.0/mod.ts";

const server = serve({ port: 3000 });
for await (const req of server) {
    staticFiles('/public', {
        prefix: '/public'
    })(req);
}
