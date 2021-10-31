# Header

Headings are used for rendering headlines.

Heading composes `box` so you can use all the style props and add responsive styles as well. It renders an `<h2>` tag by default.

## Accessibility

Do not use headers when you only want a different font size.

> Nest headings by their rank (or level). The most important heading has the rank 1 (`<h1>`), the least important heading rank 6 (`<h6>`). Headings with an equal or higher rank start a new section, headings with a lower rank start new subsections that are part of the higher ranked section.
>
> Skipping heading ranks can be confusing and should be avoided where possible: Make sure that a `<h2>` is not followed directly by an `<h4>`, for example. It is ok to skip ranks when closing subsections, for instance, a `<h2>` beginning a new section, can follow an `<h4>` as it closes the previous section.