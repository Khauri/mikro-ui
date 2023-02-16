# mikro-test

This is a generic marko component snapshot testing library [based on the strategies seen in Marko's own libraries](https://github.com/marko-js/tags-api-preview/tree/main/src/__tests__).

This package can be used with any testing library such as jest, mocha, or vitest.

## Usage

Using vitest as an example, in any given test file the most basic setup you can have is:

```js
import {describe} from 'vitest';
import {fixture} from '@mikro-ui/test';

describe(
  "<button> click",
  fixture('./templates/button/click.marko', {disabled: false}),
);
```

This simply renders the template at the path supplied and passes in the second argument as the input.

You can perform additional steps and actions by using the `.step()` method.

This method accepts either an object which will be passed in as the new input to the template _or_ a function that will receive the context of the template along with some utils, allowing you to perform more complex actions such as clicking a button or making assertions. If the function returns a promise, it will be awaited before moving onto the next step.

```js

const buttonClickHandler = vi.fn();

describe(
  '<button> click',
  fixture('./templates/button/click.marko', {disabled: true, onClick: buttonClickHandler})
    .step({disabled: false})
    .step(async ({fireEvent, screen}) => {
      await fireEvent.click(screen.getById("btn"));
      expect(buttonClickHandler).has.been.called;
    });
)
```

### Snapshot testing

A snapshot is just the output html from any given step defined by the fixture.

After each step is rendered, the closest `__snapshot__` directory will be checked for a snapshot that matches the name of the test and the output html is compared. The test will pass if the snapshot matches and will fail otherwise. This is useful for ensuring that changes to components do not accidentally cause regressions.

The first time a test is added there will not be any snapshots, so you will need to generate them. Additionally, after changing a component you will need to update the snapshots so that the new snapshots match the desired results. Both of these are done by either setting `UPDATE_MIKRO_SNAPSHOTS` to `true` in the environment _or_ by passing in `--update-snapshots` as an argument:

```js
{
  "scripts": {
    "test:update" : "npm run mocha -- --update-snapshots",
    "test:update-alt": "UPDATE_MIKRO_SNAPSHOTS=true npm run moch
  }
}
```

This will create a `__snapshots__` directory in the same directory of the test being run if one does not exist and then save the snapshots as a series of html files, one for each step and environment target (web and server).

Be sure to manually review the snapshots for unwanted changes. These snapshots **should** be added to the version control.

## Development

```sh
yarn install
yarn run build
```

### TODO

- Esbuild is used for ts compilation because it's fast, but still need to build types separately. 
- Mark all node_modules as external in esbuild. Otherwise it bundles them into the output.

