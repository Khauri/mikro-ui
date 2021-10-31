module.exports = {
  routes: [
    {
      title: "Getting Started",
      path: "/docs"
    },
    {
      title: "Theming",
      path: "/docs/theming",
      heading: true,
      routes: [
        {
          title: "fonts",
          path: "/docs/theming/fonts",
        },
        {
          title: "components",
          path: "/docs/theming/components",
        }
      ]
    },
    {
      title: "Layout",
      heading: true,
      routes: [
        {
          title: "Box",
          path: "/docs/layout/box",
        },
        {
          title: "Container",
          path: "/docs/layout/container",
        }
      ]
    },
    {
      title: "Typography",
      heading: true,
      routes: [
        {
          title: "Text",
          path: "/docs/typography/text"
        },
        {
          title: "Header",
          path: "/docs/typography/header"
        }
      ]
    }
  ]
}