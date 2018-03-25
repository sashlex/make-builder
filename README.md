## Make your project builder

### Usage:
- for use this builder, you should understand how it works;
- make "npm install" in root and in "project/src/" directories;
- overview files in "builder/" and "project/src/" and understand;
- run commands, and make changes as you want;

---
### Overview:
- "builder/" - directory contain builder code;
- "project/src/" - directory contain project sources;
- "project/dist/" - distribution directory will contain compiled sources;
- "builder/builder.js" - main builder module;
- "builder/data.js" - describe your sources here;
- "builder/workers/" - place your source handlers here;

---
### Default build commands:
- "npm run build" - build all sources;
- "npm run build html" - build sources by type (default: asset, html, css, js);
- "npm run watch" - watch all sources;
- "npm run watch html" - watch sources by type (default: asset, html, css, js);
- "npm run clean" - clean "project/dist/";
- "npm run clean html" - clean "project/dist/" by type (default: asset, html, css, js);
- "npm run app" - run your application;
- "npm test" - test builder;