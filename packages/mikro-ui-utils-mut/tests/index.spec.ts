import {describe, it} from 'vitest';
import {fixture, setTestFunction} from '@mikro-ui/test';

setTestFunction(it);

describe(
  'simple test',
  fixture('./mutable-counter/mutable-counter.marko')
    .step(async ({rerender, fireEvent, screen}) => {
      await fireEvent.click(screen.getById("btn"));
      await rerender();
    })
);