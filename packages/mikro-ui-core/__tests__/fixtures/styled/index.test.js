const {fixture, setTestFunction} = require('@mikro-ui/test');

setTestFunction(it);

describe(
  '<styled> returns list of classnames in class mode', 
  fixture('./class-mode.marko'),
);

describe(
  '<styled> returns inline styles in style mode', 
  fixture('./style-mode.marko'),
);

describe(
  '<styled> returns hashed styles in fly mode', 
  fixture('./fly-mode.marko'),
);

describe(
  '<styled> accepts mode from provider',
  fixture('./mode-from-provider.marko'),
);