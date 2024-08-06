# tw-preflight-scope

`tw-preflight-scope` is a [Tailwind CSS](https://tailwindcss.com/) plugin that allows you to scope Tailwind's preflight styles to a specific selector. This is useful when you want to use Tailwind CSS in a specific part of your application without affecting the global styles.

## Installation

You can install `tw-preflight-scope`

```bash
npm install tw-preflight-scope
```

## Usage

```js
// tailwind.config.js
const { twPreflightScope } = require('tw-preflight-scope');

module.exports = {
  // ... other configurations
  plugins: [
    twPreflightScope({ scope: '.tw-scope' }),
    // ... other plugins
  ],
};
```

In this example, `.tw-scope` is the selector where you want to apply Tailwind's preflight styles. You can change this to any valid CSS selector.

## How it works

This plugin scopes Tailwind's preflight styles to a specific selector. Here's how you can use it in a Next.js or React application:

1. It disables Tailwind's global preflight styles.
2. It applies the preflight styles only within the specified scope.

### Example with React

In your root component (e.g., App.js or App.tsx):

```js
import './styles/tailwind.css'; // Your Tailwind imports

function App() {
  return {
    /* components */
  };
}
export default App;
```

```js
function TwScopedComponent() {
  return (
    <div className="tw-scope">
      <h1 className="text-2xl font-bold">Hello, scoped Tailwind!</h1>
    </div>
  );
}
export default TwScopedComponent;
```

Tailwind's preflight styles will only be applied within the div with the `tw-scope` class.

Components inside this div will receive Tailwind's reset styles.
Elements outside this div will not be affected by Tailwind's preflight styles.

This approach is particularly useful when integrating Tailwind into existing projects or when you need to isolate Tailwind's styles to a specific part of your application.
