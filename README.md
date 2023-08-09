# Rambda scripts

Contains most scripts required to build `Rambda/Rambdax` related files.

## Requirements

Both repos `selfrefactor/rambda` and `selfrefactor/rambda-scripts` should be on the same level in the file system.

## Release steps - short version

1. `yarn out`

2. `yarn publish minor`

3. `yarn docs`

## Release steps - full version

1. Build readme

1. Build readme

`yarn out`

2. Publish to NPM

npm version minor

`run bump minor`

`run bump patch`

5. Publish to Github

`yarn github`

7. Update documentation site

`yarn docs`

8. After NPM publish manual check

Manual check for TypeScript definitions

> inside `rambda-scripts` folder

`yarn check-ts`

## Rambdax release steps

1. Build readme

`yarn x`

2. Build output

inside Rambdax folder

`yarn install`

`yarn build`

3. Publish to NPM

`run bump minor/patch`

4. Update documentation site

`yarn docs`

## Github releases

1. Install - For Arch linux: `yay -S github-cli`

2. Run `gh auth login`

3. Run `gh config set prompt disabled`

## Scripts

### Check before release

`yarn consume`

### Update benchmark summary

If benchmarks are changed, then their summary should also be updated.

`yarn summary`
