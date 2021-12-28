const {fixture, setTestFunction} = require('@mikro-ui/test');

setTestFunction(it);

describe(
  '<box> renders',
  fixture('./basic.marko')
);

describe(
  '<box> uses custom element',
  fixture('./custom-element.marko')
);

describe(
  '<box> custom element passes events',
  fixture('./custom-element-passes-events.marko')
    .step(async ({getByText}) => {
      const el = await getByText('clicked');
      console.log(el.click());
    })
);
