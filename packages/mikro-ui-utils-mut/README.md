# Mikro-Ui Mut

Like `<let>` but with superpowers.

> Warning: No benchmarking has been performed. In its current state, this may cause deoptimizations, performance issues, or conflict with future Marko features. Get frisky at your own risky.

By default Marko deep freezes any object you pass to `<let>`, `<const>`, `<return>`, or 
destructure from `<attrs>`, making you unable to mutate them. Instead you have to treat them as immutable and assign to them directly.

This is so that Marko can ensure that mutations to objects don't result in the UI not updating, but I've personally found that this can create an awkward and unintuitive DX.

This package represents an idea and implementation that allows a bit more flexibility when it comes to mutations. Instead of forcing assignments, we use fun js stuff

## Usage

The `mut` tag accepts any js value and returns a lightweight Proxy that tracks assignments deeply. In theory this should work for Arrays, Objects, Sets, and Maps and their associated mutating methods.

```marko
<mut/counter = {value: 0} />

<button onClick(){
  // all valid ways of incrementing counter
  counter.value++;
  counter.value += 1;
  counter(curr => ({value: curr.value + 1}));
  counter = {value: counter.value + 1};
  // counter.value is now incremented by 4
}>
  ${counter.value}
</button>
```

If you would prefer _not_ to track the value, use the `umut` (untracked mutable) tag instead. 

```marko
<umut/counter = {value: 0} />

<button onClick() {
  // This will update counter but won't trigger a state update
  counter.value += 4;
  // call value as a function to unwrap the Proxy.
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

When an object is passed into the `<mut>` tag it is deep cloned since it's is already frozen by the time it's reaches the inside of the tag. However, this can be problematic for unfreezable structures. Luckily `<mut>` allows you to pass in a function which will prevent the object from being frozen. 

```marko
<mut/obj = () => new MutableObject() />

<effect(){
    obj.marko = 'polo';
}/>

-- ${obj.polo}
```
