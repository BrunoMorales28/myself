/**
 * MSW intercepts network requests at the Node `fetch`/`Request`/`Response`
 * level, but jsdom (Jest's test environment) doesn't provide those globals.
 * This file polyfills them from Node's built-ins/`undici` before jsdom takes
 * over, per MSW's documented Jest setup. Uses `require` (not `import`) so
 * the globals below exist before `undici` itself is loaded — `undici`
 * reads `TextDecoder`/`TextEncoder` off `globalThis` at import time.
 *
 * Plain JS (not .ts): keeps it out of the TypeScript project entirely, since
 * declaring these on `globalThis` conflicts with the DOM lib's own types.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const { TextDecoder, TextEncoder } = require("node:util");
const { ReadableStream, TransformStream } = require("node:stream/web");
const { performance } = require("node:perf_hooks");
const { Blob, File } = require("node:buffer");

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder, configurable: true },
  TextEncoder: { value: TextEncoder, configurable: true },
  ReadableStream: { value: ReadableStream, configurable: true },
  TransformStream: { value: TransformStream, configurable: true },
  performance: { value: performance, configurable: true },
});

const { fetch, Headers, FormData, Request, Response } = require("undici");

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true, configurable: true },
  Blob: { value: Blob, configurable: true },
  File: { value: File, configurable: true },
  Headers: { value: Headers, configurable: true },
  FormData: { value: FormData, configurable: true },
  Request: { value: Request, configurable: true },
  Response: { value: Response, configurable: true },
});
