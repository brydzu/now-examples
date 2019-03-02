# Preact

In this example we will be deploying preact default template with all features using preact-cli.

### Getting started with Preact

- Start a new Preact project:

```
npx preact create default <project name> --yarn
```

### Deploy with Now

First we need to create a `now.json` configuration file to instruct Now how to build the project.

For this example we will be using our newest version [Now 2.0](https://zeit.co/now).

By adding the `version` key to the `now.json` file, we can specify which Now Platform version to use.

We also need to define each builders we would like to use. [Builders](https://zeit.co/docs/v2/deployments/builders/overview/) are modules that take a deployment's source and return an output, consisting of [either static files or dynamic Lambdas](https://zeit.co/docs/v2/deployments/builds/#sources-and-outputs).

Then we need to add a `now.json` file to specify we want to use our Platform V2.

In this case we are going to use `@now/static-build` to build and deploy our Preact application selecting the `package.json` as our entry point. We will also define a name for our project (optional).

```json
{
  "version": 2,
  "name": "my-preact-app",
  "builds": [
    {
      "src": "package.json",
      "use": "@now/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    { "src": "^/assets/(.*)", "dest": "/assets/$1" },
    {
      "src": "^/(.*)\\.(.*)\\.(js|css|json|css.map|js.map)$",
      "headers": { "cache-control": "Immutable" },
      "dest": "/$1.$2.$3"
    },
    { "src": "^/(.*)\\.(js|css|json|css.map|js.map)$", "dest": "/$1.$2" },
    { "src": "^/(.*)", "dest": "/index.html" }
  ]
}
```

Visit our [documentation](https://zeit.co/docs/v2/deployments/configuration) for more information on the `now.json` configuration file.

We also need to include a script in `package.json` named `"now-build"` that specifies what command Now will run on the server to "build" your application. By default, preact-cli will output the build to the `build` directory, which is configured in the above `now.json` file.

```json
{
    "scripts": {
        ...
        "now-build": "npm run build"
    }
}
```

We are now ready to deploy the app.

```
now
```

## CLI Commands

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# test the production build locally
npm run serve

# run tests with jest and preact-render-spy
npm run test
```

For detailed explanation on how things work, checkout the [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).
