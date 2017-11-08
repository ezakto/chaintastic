# chaintastic
Create chainable sync/async APIs easily

## Install

```
npm install chaintastic
```

## Basic usage

Create a chain with a set of chainable methods:

```
import Chaintastic from 'chaintastic';

const chain = Chaintastic({
  sum(a, b) {
    return a + b;
  }
  display(value) {
    return 'Your number is ' + value;
  }
});
```

Your chain is ready to go! You can wrap a initial value using the `init` method, and then chain methods. The return value of a method call is passed as the first argument of the next method call. You can end the chain using `then`.

```
chain.init(10).sum(5).display().then(console.log); // 'Your number is 15'
```

## Async usage

You might want to perform async operations in your chained methods. You can do it in two ways:

### Callbacks

Every method call is also passed a callback function as the last argument. If your method returns `undefined`, Chaintastic will assume that you're going to use the callback at some point.

```
const chain = Chaintastic({
  getValue(cb) {
    setTimeout(() => cb('world'), 5000);
  }
  display(value) {
    return 'Hello, ' + value + '!';
  }
});

chain.getValue().display().then(console.log); // 'Hello, world!' after 5 seconds
```

### Promises

Or, you can return a *thenable* value, like a Promise. If the return value is a thenable, then the next method call will follow it.

```
const chain = Chaintastic({
  getHTML() {
    return fetch('https://www.example.com').then(body => body.text());
  }
  display(value) {
    return 'Source code:\n' + value;
  }
});

chain.getHTML().display().then(console.log); // 'Source code: ...' after load finished
```


## Getters

Primitives would be mapped to getter functions.

```
const chain = Chaintastic({
  name: 'Nicolás',
  greet(name) {
    return 'Hello, ' + name + '.';
  }
});

chain.name().greet().then(console.log); // 'Hello, Nicolás.'
```

