import { VirtualConsole } from 'jsdom';
import createBrowser from 'jsdom-context-require';
import register from '@marko/compiler/register';

register({ meta: true, optimize: false } as any);

export const browser = createBrowser({
  dir: __dirname,
  extensions: register({
    extensions: { ...require.extensions },
    optimize: false,
    output: "dom",
  }),
  virtualConsole: new VirtualConsole().sendTo(console, {
    omitJSDOMErrors: true,
  }),
} as any);
