# Async / Await

Async/Await is a relatively new syntax available in JS, but also in C#, C++, and other languages.
This is based on the idea of `promise`s and may be implemented in different ways (a common strategy is to use `generator` functions or `coroutines` which are functions that can `yield` (return) and resume multiple times).

## Promise

A `promise` is exactly what it sounds like: an agreement to "keep" an agreement - in the future.
A promise has the following states:
- pending / waiting
- fulfilled
- rejected

A fulfilled promise is just a regular value that you can pass around and use like you would use any other value.
A rejected promise is often a thrown error.

The most interesting thing about promises are when they are pending or waiting.
A promise may be passed around in a variable _even_ before it if fulfilled or rejected, and _while_ it is still pending or waiting.

### Asynchronous operations

Promises may be fulfilled or rejected asynchronously: i.e. they can be fulfilled or rejected at any time.

Because asynchronous operations also have the property that they could complete at any time, they can usually be represented by promises.
For example, the following could be promises for a future value:
- the key that the user will press (or not press before timeout)
- the result of a database query at the time the query is sent to the database
- the data that will eventually be returned by an http request

## Async / Await

The `async` and `await` keywords is language-level support for the idea of waiting for the future result of an operation.

### `async`

The `async` keyword is used to identify a function that contains an `await`.
An `async` function will always return a `promise`.
Because the `async` function returns a `promise`, the caller can `await` the resolution (fulfillment or rejection) of the `promise` at any time, or even return the promise in turn.

Any function that `await`s another `async` function _must_ also be an `async` function: this is enforced by the language.

### `await`

The `await` keyword is used to wait for a promise to be resolved.
`await`ing an already-resolved promise just returns the resolved value.

By using `await`, you can coordinate asynchronous operations so that the resolved result of one operation can be used as input to another operation.

## Examples

Since http requests are asynchronous operations, they can be used to demonstrate async/await.
You may want to try the following fake data sources that return `json` data::
- https://jsonplaceholder.typicode.com/
- https://fakedata.dev/
- http://www.jsontest.com/ (this service may be over quota)

The following examples work in playcode.io.

`index.html`
```html
<div>
  <input type="text" id="todo" value="1">
  <input type="button" id="todo_button" value="go">
</div>

<h2>todo</h2>
<div id="todo_result">todo data</div>

<h2>user</h2>
<div id="user_result">user data</div>
```

`style.css`
```css
body {
  background-color: white;
}
```

`script.js`
```js
$('#todo_button').click(async () => {
  const todoVal = $('#todo').val();

  const todoData = await $.get(`https://jsonplaceholder.typicode.com/todos/${todoVal}`);
  console.log(todoData);
  $('#todo_result').html(JSON.stringify(todoData));

  const userData = await $.get(`https://jsonplaceholder.typicode.com/users/${todoData.userId}`);
  console.log(userData);
  $('#user_result').html(JSON.stringify(userData));
});
```

## Exercises

- Add an http request to get data from: https://fakedata.dev/users/v1/get_random_user
- modify the example above so that
  - the http requests are wrapped in functions that take one parameter each
  - there is a function that returns the `userId` of todo `n`
- display the returned data more neatly