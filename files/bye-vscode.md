Workaround when using `debugger` keyword:


```
{
      "type": "node",
      "request": "launch",
      "name": "Jest(not working with breakpoints)",
      "program": "${workspaceRoot}/node_modules/jest/bin/jest.js",
      "preLaunchTask": "build",
      "args": [
        "--verbose", 
        "-i", 
        "--no-cache",
        "--config",
        "${workspaceRoot}/jest2.config.js",
        "dist/foo.spec.js"
      ],
      "disableOptimisticBPs": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
```    

jest2.config.js contains only {bail: false}

---

Also removed is simple TS debug

launch.json

```
 {
      "type": "node",
      "request": "launch",
      "name": "TS",
      "program": "${workspaceFolder}/src/foo.ts",
      "preLaunchTask": "build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
```

tasks.json

```
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "build",
      "type": "shell",
      "command": "tsc -p tsconfig.json"
    }
  ]
}
```