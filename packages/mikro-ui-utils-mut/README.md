# Mikro-Ui Mut

By default Marko deep freezes any object you pass to `<let>`, `<const>`, `<return>`, or 
destructure from `<attrs>`, making you unable to edit them.

This is so that Marko can ensure that mutations to objects don't result in the UI not updating, but sometimes that is exactly the behavior you want.

## Usage

The `mut` tag accepts any js value and returns a getter/setter function.

```marko
<mut/value = {} />

<effect(){


} />
<button onClick(){
    value = value() + 1;
}>
  ${value}
</button>
```

You can also reassign the value like you can with `let`.

```marko
<mut/value = 123 />

<button onClick(){
    value = value() + 1;
}>
  ${value}
</button>
```