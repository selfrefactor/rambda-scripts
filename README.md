# Rambda scripts

Contains most scripts required to build `Rambda/Rambdax` related files.

## Requirements

Both repos `selfrefactor/rambda` and `selfrefactor/rambda-scripts` should be on the same level in the file system.

## Release steps

1. `yarn out`

2. Publish to NPM

## After release checks

1. find-lowest-ts-version 

===
# Other info

## Github releases setup

> !important - if it is done manual, version title should be `v8.5.0` and not `8.5.0`, while tag value itself is `8.5.0`

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