## Make your project builder.
***This project not claim on best practices.***

### Usage:
- for use this builder, you must understand how it works;
- make "npm install" in root and in "source" directories (in "dist" after first build);
- try run commands, go through code, understand, and make your changes;
- you must change and improve builder code as you want;
- builder work out of the box and demonstrate basic usage;
- the lack of this approach, where we change builder code as we want, is that each project will have own specified builder code;
- this is mostly boilerplate;

---
### Default build commands:
***Commands configurable from package.json***
- "npm run build" - build all sources;
- "npm run build html" - build sources by type (default: asset, html, css, js);
- "npm run watch" - watch all sources;
- "npm run watch html" - watch sources by type (default: asset, html, css, js);
- "npm run clean" - clean "dist" directory;
- "npm run clean html" - clean "dist" directory by type (default: asset, html, css, js);
- "npm run app" - run your application;
- "npm run test" - test builder;

---
### Overview:
- "builder" - directory contain builder code;
- "sources" - directory contain project sources;
- "dist" - distribution directory will be contain compiled sources;
- "builder/Builder.js" - main builder file;
- "builder/data.js" - describe your sources here;
- "builder/LazyContainer.js" - require your builder libraries here;
- "builder/workers" - place your source handlers here;
