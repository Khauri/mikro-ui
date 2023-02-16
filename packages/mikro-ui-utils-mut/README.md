# Mikro-Ui Mut

Like `<let>` but looser.

> Warning: No benchmarking has been performed. In its current state, this may cause deoptimizations, performance issues, or conflict with future Marko features. Get frisky at your own risky.

### Why?

By default Marko deep freezes any object you pass to `<let>`, `<const>`, `<return>`, or 
destructure from `<attrs>`, making you unable to mutate them. Instead you have to treat them as immutable and assign to them directly.

This is partially so that Marko can ensure that mutations to objects don't result in the UI not updating, but I've personally found that this can create an awkward and unintuitive DX.

This package represents an implementation _of an idea_ that allows a bit more flexibility when it comes to mutations at a potential cost to performance.

## Usage

The `mut` tag accepts any js value or a function that returns a value and returns a getter/setter function that also proxies the original object.


Take this first example, which doesn't really work:

```marko
<let/count={value: 1}/>
<button onClick() { count.value++ }>
  ${count.value}
</button>
```

Marko has no way of knowing `count.value` was incremented.
Simply by replacing `<let>` with `<mut>` the example now does work:

```mark
<mut/count={value: 1}/>
<button onClick() { count.value++ }>
  ${count.value}
</button>
```

This is because the value passed into `<mut>` is wrapped in a Proxy that triggers an update 

There are actually a few different ways to update a mutable variable.

```marko
<mut/counter = {value: 0} />

<button onClick(){
  // The following are all valid ways of incrementing counter
  // Directly mutate nested properties
  counter.value++; 
  counter.value += 1;
  // Use as the setter function
  counter(curr => ({value: curr.value + 1}));
  // Assign directly
  counter = {value: counter.value + 1};
  // counter.value is now incremented by 4
  // call counter() as a function to unwrap the Proxy when logging
  console.log(counter()); // {value: 4}
}>
  ${counter.value}
</button>
```

If you would prefer _not_ to have mutations trigger state updates, use the `umut` (untracked mutable) tag instead. 

```marko
<umut/counter = {value: 0} />

<button onClick() {
  // This will update counter but won't trigger a state update
  counter.value += 4;
  console.log(counter()); // {value: 4}
}>
  ${counter.value}
</button>
```

If you want to be able to selectively enable or disable the toggling feature, the `<mut>` tag supports an `untracked` variable.

```marko
<let/untracked = false />
<mut/count = 0 untracked=untracked />

<button onClick(){count++;}> ${count} </button>
<button onClick(){untracked = !untracked}> isTracked: ${untracked} </button>
```

### Unfreezable structures

Some structures, such as Mobx Observables, will throw an error if you try to freeze them.

When a plain object or array is passed into the `<mut>` tag it is deep cloned since it's is already frozen by the time it's reaches the inside of the tag. However, this can be problematic for unfreezable structures. Luckily `<mut>` allows you to pass in a function which will prevent the object from being frozen. 

```marko
<mut/obj = () => new MutableObject() />

<effect(){
    obj.marko = 'polo';
}/>

-- ${obj.polo}
```
