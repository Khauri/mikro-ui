const {fixture, setTestFunction} = require('mikro-test');

setTestFunction(it);

describe(
  '<box> renders',
  fixture('./basic.marko')
);