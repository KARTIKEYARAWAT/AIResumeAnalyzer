import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import type { Plugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from "fs";
import path from "path";

// A custom plugin to serve our Vercel-style Edge API routes locally
const apiPlugin = (): Plugin => ({
  name: 'api-plugin',
  configureServer(server) {
    const env = loadEnv(server.config.mode, process.cwd(), '');
    Object.assign(process.env, env); // Ensure API routes can read process.env.SUPABASE_URL

    server.middlewares.use(async (req, res, next) => {
      if (req.url?.startsWith('/api/')) {
        const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const apiPath = url.pathname.replace('/api/', ''); // e.g. analyze
        const filePath = path.resolve(process.cwd(), `api/${apiPath}.ts`);
        if (fs.existsSync(filePath)) {
           try {
             const module = await server.ssrLoadModule(filePath);
             const headers = new Headers();
             for (const key in req.headers) {
               if (req.headers[key]) headers.append(key, req.headers[key] as string);
             }
             const buffers: Buffer[] = [];
             for await (const chunk of req) {
               buffers.push(chunk as Buffer);
             }
             const bodyBuffer = Buffer.concat(buffers);
             const request = new Request(url.href, {
               method: req.method,
               headers,
               body: req.method === 'GET' || req.method === 'HEAD' ? undefined : bodyBuffer
             });
             const response: Response = await module.default(request);
             res.statusCode = response.status;
             response.headers.forEach((value, key) => {
               res.setHeader(key, value);
             });
             if (response.body) {
                const arrayBuffer = await response.arrayBuffer();
                res.end(Buffer.from(arrayBuffer));
             } else {
                res.end();
             }
             return;
           } catch (e: any) {
             console.error("API Error locally:", e);
             res.statusCode = 500;
             res.end(e.toString());
             return;
           }
        }
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), apiPlugin()],
  envPrefix: ["VITE_", "SUPABASE_"],
});
