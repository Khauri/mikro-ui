# Mikro Style

This is the main style parser used by mikro.

This system is in charge of efficiently parsing a style object into one or more css rules, which can then be inserted into the DOM.

## Modes

The parser can operate in three different modes.
### css

Mikro style will output css that can be inserted into a stylesheet. This is similar to css-in-js.

This mode is most useful for keeping your css bundles limited to what's being used. It's also excellent for server-side-rendering.

### atomic

Atomic classes, also called utility classes, are commonly used in libraries like tailwind and bootstrap.

The mapping can be configured in a very fine grained way to perfectly match any library in particular as long as the utility classes aren't simply randomly generated.

This mode is useful if you happen to already be using an atomic css library, allowing you to use Mikro-based components without changing your css setup.

You can also build atomic classes stylesheets from a theme file automatically by using the @mikro-ui/tokens.

### inline

This mode is most useful for rendering emails, where style tags are often forbidden or ignored.
Not recommended for standard application use.

### Support Tables

Here are the support tables for the three modes.