# Development

## Requirements
Ensure that the following tools are installed:
- Go 1.18 ([install instructions](https://go.dev/doc/install))
- Node 16.x.x ([install instructions](https://nodejs.dev/learn/how-to-install-nodejs))
- Goreleaser ([install instructions](https://goreleaser.com/install/))

Run the following commands after a fresh clone:
- `make install-tools` (this will install development tools)
- `make init-server` (this will initialize the server config)

## Local Build
To run a local build:
1. Run `make dev`
2. Navigate to `http://localhost:3000`

## Testing
The following commands are used to run tests:
1. `make test` (this will run server tests)
2. `make ui-test` (this will run ui tests)

## Other Commands
- `make build` (this will create a build of bindplane-op)
- `make swagger` (this will create swagger documentation)
- `make generate` (this will generate the graphql server)
