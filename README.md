# Reproduction of error in trash in Next.js

Example works by attempting to send a file called 'file-to-delete.txt' to trash.

## Prequisites:

- Reproducable on Windows

## Steps to reproduce:

- Start dev server with `npm run dev`.
- Click button "Attempt to delete file"

## If you want to debug with debugger in VSCode:

- Open the "Run and debug" (Ctrl + Shift + D) tab in VSCode. Then click "JavaScript Debug terminal"
- Run dev server with `npm run dev`
- Put breakpoint on the line `await trash(...)` in the action in actions/delete.ts
- Click the button "Attempt to delete file" in UI.
- I don't know a great way to put breakpoints in the node_modules packages on the server (if anyone knows a good way, give me a shout!), I usually click "Step into" (F11) or "Step Over" (F10) until I somehow reach the `\(action-browser)\node_modules\trash\index.js` file. From there you could put a break point on line 66 which says `return module.default(paths);`. The next "Step into" should put you in the `\(action-browser)\node_modules\trash\window.js` file. Put a breakpoint in the `windows()` function and "Continue" (F5). From there you can see the protocol is missing on the URL object in the `binary` variable which eventually leads to the error/exception **ERR_INVALID_ARG_TYPE** being thrown.

## Temporary fix

My temporary fix in my side-project has been to download the [recycle-bin binary](https://github.com/sindresorhus/recycle-bin) directly and then copied the logic from https://github.com/sindresorhus/trash/blob/main/lib/windows.js and https://github.com/sindresorhus/trash/blob/main/lib/chunked-exec.js except that the binary was "imported" like this `const pathToRecycleBinary = dirname(dirname(import.meta.url)) + "/binary/recycle-bin.exe";`

Ala this:

```typescript
"use server";

import { promisify } from "node:util";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import chunkify from "@sindresorhus/chunkify";
import { dirname } from "node:path";

const pathToRecycleBinary =
  dirname(dirname(import.meta.url)) + "/binary/recycle-bin.exe";
const pExecFile = promisify(execFile);

export async function deleteFile(path: string) {
  for (const chunk of chunkify([path], 200)) {
    const urlToBinary = fileURLToPath(pathToRecycleBinary);
    await pExecFile(urlToBinary, chunk);
  }
}
```

# Next.js app

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
