export const packageStructure = `
├── package.json
├── ts
│   └── ...
├── css
│   └── ...
├── package (generated)
│   ├── dependency-based
│   │   ├── cjs
│   │   │   ├── <package-name>.d.ts
│   │   │   ├── <package-name>.js
│   │   │   ├── <package-name>.js.map
│   │   │   ├── <package-name>.min.js
│   │   │   ├── <package-name>.min.js.map
│   │   │   └── <package-name>.min.js.gz
│   │   ├── esm
│   │   │   └── ...
│   │   └── iife
│   │   │   └── ...
│   ├── standalone
│   │   ├── cjs
│   │   │   └── ...
│   │   ├── esm
│   │   │   └── ...
│   │   └── iife
│   │   │   └── ...
│   └── <package-name>.css
`
