# Rambda scripts

Contains most scripts required to build `Rambda/Rambdax` related files.

## Requirements

Both repos `selfrefactor/rambda` and `selfrefactor/rambda-scripts` should be on the same file system level.

## Release steps

1. Build readme

`yarn out`

2. Build output

`yarn build`

3. Test output

`yarn consume`

4. Publish to NPM

`run bump minor/patch`

5. Fix package.hjson

`yarn deps`

6. Publish to Github

`yarn github`

7. Update documentation site

`yarn docsify`

## Rambdax release steps

1. Build readme

`yarn x`

2. Build output

inside Rambda folder

`yarn`

`yarn build`

3. Test output

`yarn consume`

4. Publish to NPM

`run bump minor/patch`

5. Update documentation site

`yarn docsify`

## Github releases

1. Install - For Arch linux: `yay -S github-cli`

2. Run `gh auth login`

3. Run `gh config set prompt disabled`

4. Now from `rambda` repo after NPM version is published, run `yarn release`

## Scripts

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