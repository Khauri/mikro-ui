const {fixture, setTestFunction} = require('@mikro-ui/test');

setTestFunction(it);

describe(
  '<css> outputs style tag', 
  fixture('./basic.marko'),
);

describe(
  '<css> custom id', 
  fixture('./custom-id.marko'),
);