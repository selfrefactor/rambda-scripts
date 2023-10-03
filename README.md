# Rambda scripts

Contains most scripts required to build `Rambda/Rambdax` related files.

## Requirements

Both repos `selfrefactor/rambda` and `selfrefactor/rambda-scripts` should be on the same level in the file system.

## Release steps

1. `yarn before`

2. `npm version minor`

3. `npm publish`

4. `yarn github`  - `git push origin v8.5.0` once `gh release create v8.5.0` is executed

## After release checks

1. find-lowest-ts-version 

## Rambdax release steps

1. Build readme

`yarn x`

2. Build output

inside Rambdax folder

`yarn install`

`yarn build`

3. Publish to NPM

4. Update documentation site

`yarn docs`

===
# Other info

## Github releases setup

1. Install - For Arch linux: `yay -S github-cli`

2. Run `gh auth login`

3. Run `gh config set prompt disabled`

## Scripts

### Check before release

`yarn consume`

### Update benchmark summary

If benchmarks are changed, then their summary should also be updated.

`yarn summary`

### Manual check for TypeScript definitions

> inside `rambda-scripts` folder

`yarn check-ts`