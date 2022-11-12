# Mikro JSDOC TagDef

Transforms JSDOC comments in your Marko tags to a `marko-tag.json`.

This was extracted from an internal tool and will likely be deprecated when Marko has completed typsecript support.
Use at your own risk. Usage of version control is highly recommended for when it gets scuffed up...

## Usage

Use JSDOC to annotate any Marko component. This should only be written in either one of the `.component.js` or `.marko` files.
Prefer to use the `.component.js` over the `.marko`.

```marko
/**
 * @tag MyTag
 * @description 
 * @prop {boolean} [isCool] - true if cool
 * @emits click - Called when something is clicked
 * @example Example, using tabstops
 * <my-tag isCool=${1:isCool} onClick=$2>
 *   $0
 * </my-tag>
 */
<attrs/{isCool, onClick} />
<button onClick(){}> isCool: ${isCool} </button>
```

Note that you _must_ begin the comment with the `@tag` tag (or you can use `@component` if you prefer).

### Cli Usage

Use cli with npx:
```sh
npx @mikro-ui/jsdoc-tagdef@latest --write
```

This will output a `marko-tags.json` for any relevant component files.

### SDK Usage

```js
// npm install @mikro-ui/jsdoc-tagdef
import {analyzeFile, analyzeText, convertFiles} from '@mikro-ui/jsdoc-tagdef';
// convert files in an entire directory (this is the main command from the cli)
convertFiles('./components', {write: true});
// analyze a single file
const result = analyzeFile('./components/foo/foo.marko');
// analyze text
const result = analyzeText('/* @tag ... */');
```

### Example Tab Stops

Including the `@example` tag will automatically generate a snippet for the tag for autocomplete purposes.
The first line of the example should be a short description of the snippet followed by the example itself.

The example also supports tab stops.
Using numbered stops such as `$1`, `$2` will allow the user to hit their tab key and jump to that section.
`$0` is used as the exit position of the cursor after all other tab stops.

### Caveats

- The tag _must_ be isolated in its own folder.
- Adding a default to the props will not work. This is because no matter what you put here it'll always result in a string.