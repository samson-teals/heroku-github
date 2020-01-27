## Regular expressions

Regular expressions are used for pattern matching in strings.
You may have seen this in JAVA already, and it is built into Javascript as a feature of the language (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).

### Examples

The character classes `\d` and `\w` are commonly used and correspond to `digits` and `word` characters.
The `+` modifier means one-or-more of the preceding thing (character or character class).

Try the following regular expressions using an online tool such as https://www.regexpal.com/

- `\d+`
  - with test string `abc123xyz456`
- `\d+-\w+`
  - with test string `abc-123-xyz-456`

What are the matches that are highlighted?

Try some other patterns with different modifiers.
What patterns can you use that can be used to match the strings `APCsA` and `APCsP`?
Is there a pattern that can be used to only match those two strings?

## Using regular expressions to create web server routes

The `fastify` nodejs package that we've been using (behind the scenes) exposes a subset of regular expresssion functionality to make creating server routes more convenient.
You can find documentation at https://github.com/fastify/fastify/blob/master/docs/Routes.md#url-building.

### Server routes

Server routes are used to map the URL that you type into your browser with a handler that gets executed on the server in response to an http request to that URL.

For example, if you go to `http://some.server.com/listdb`, the handler there will list all the databases that can you can reset to.
Likewise, going to `http://some.server.com/initdb/shakespeare_demo` will reset the database with a template (more properly, this should be a POST request, but we'll talk about that later).

The idea is that you can create an arbitrary set of URL patterns that can be used to model how your application works.
(You can also use HTTP query parameters - the values that come after the `?` in a URL, but in many cases, path parameters are becoming more popular.)

#### Library catalog example

A library application might organize their routes like
- fiction
  - scifi
  - horror
- non-fiction
  - history
  - biography
  
With this layout, a user who goes to `/fiction` would get a list of all fiction titles.
The list can then be refined by going to `/fiction/scifi` vs `/fiction/horror`.

As an aside, what would the SQL look like to generate this refinement?

### Writing server routes

#### Absolute routes

You've already seen a few examples of absolute routes:
- `/hello`
- `/listdb`

These routes will match if the url is exactly `some.server.com/hello` or `some.server.com/listdb`.
They are absolute in that there is nothing to change in those routes.
We make a distinction between `absolute` (not a common term) and `static` routes, using `static` to refer to static files that are located in the `public` folder.

#### Regular expression routes

Regular expression routes can be as simple as the `/initdb/:templateName` route you've already seen, to routes that use more complex regular expressions such as the examples presented in the `fastify` documentation linked above:
- `/example/:file(^\\d+).txt` (the example is actually `.png` but we use `.txt` to avoid confusion)
- `/example/near/:lat-:lng/radius/:r`

The first example only  matches if `:file` only contains numeric digits: `/example/000.txt` will work, but you will get a `404` if you try `/example/1x.txt`.

The second example matches `:lat` and `:lon` with a `-` between them: `/example/near/1-2/radius/3` will work.
This is an example of a non-greedy match with the `-` character where normally, the `/` character is the only character with a non-greedy match.

### Using server routes

We've already seen examples of server routes discussed above.
In general, server routes are how you put your application together.

Try to implement server routes for the library catalog example above.

When you've done that, how can you write a route (plus a simple application) that adds two numbers when a user goes to `/example/<some number>/plus/<some number>`, but returns a `404` if anything other than two numbers are given?

### The difference between `GET` and `POST`

So far, we've only been using the HTTP `GET` method.
This is the method used whenever you directly type something into your browser's URL.

The other common HTTP method is `POST`.
This method should be used whenever changes to data is requested.
Although there are tools that developers use to make `POST` requests, most end-users will only make `POST` requests through a form presented by the browser, or through a javascript-initiated routine (e.g. `AJAX`).

For now, we will only use `GET` to keep things simple, but later we will use `POST` properly when we submit data to our applications.
