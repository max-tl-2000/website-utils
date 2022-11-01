# Website utils
Utilities and widgets for reva websites

## install
```bash
# install dependencies
yarn

# install the precommit hooks
npx changelogx install-hook

cd fake-api
yarn
```

## start development

```bash
npm run start:dev
```

- First make sure you checkout the 19.02.04 branch in the red project. And make sure to run

  ``` bash
  # this will restart the nginx proxy and register:
  # - widgets.local.env.reva.tech
  # - widgets-api.local.env.reva.tech (fake api)
  docker stop local_dev-proxy_1; ./bnr create:nginx:conf; docker start local_dev-proxy_1
  ```
- Navigate to `https://widgets.local.env.reva.tech/home` and `https://widgets.local.env.reva.tech/property/property1 to test the existing widgets

## Changing the token and tenant domain

in config.js there are 2 important variables

- TOKEN: The token to use to communicate with the api host
- TENANT_HOST: The tenant host that will be used as api host. By default this is the cucumber tenant

## Important notes

### Working with the bookAppointmentWidget
The book appointment widget does not have a mocked api yet, so it rely on a tenant named cucumber to be created and the red app being up and running and serving content from `https://cucumber.local.env.reva.tech`

An easy way to create the cucumber tenant in local is to do the following

```bash
# first make sure the red app is up and running and then
# run the following commands inside the red repo

./bnr cucumber:db:init   # this will create a cucumber tenant in red
```

### working with api hosts that are served over HTTPS://

Al tenants, (even local ones) use https to serve the api endpoints. In RED we have configured the nginx container to recognize the following domains:

- https://widgets.local.env.reva.tech --> Points to http://localhost:8081
- https://widgets-api.local.env.reva.tech --> Points to http://localhost:8090 fake-api

