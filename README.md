# Rambda scripts

Contains most scripts required to build `Rambda/Rambdax` related files.

## Requirements

Both repos `selfrefactor/rambda` and `selfrefactor/rambda-scripts` should be on the same file system level.

### Github releases

1. Install - For Arch linux: `yay -S github-cli`

2. Run `gh auth login`

3. Run `gh config set prompt disabled`

4. Now from `rambda` repo after NPM version is published, run `yarn release`

## Script

### Dynamic TSToolbelt

`yarn toolbelt`

### Check before release

`yarn consume`

### Add new method

`yarn new gte`

### Update benchmark summary

If benchmarks are changed, then their summary should also be updated.

`yarn summary`

## TODO

Script to check which TS versions are supported