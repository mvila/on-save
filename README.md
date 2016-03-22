# savey-wavey

An atom plugin for triggering shell scripts on save events. Forked from https://github.com/mvila/on-save


## Usage
Create an `.on-save.json` file at the root of you project.

For example, if you want to babelify every `.js` file from `src` to `lib`:

```javascript
{
  "commands": [
    {
      "files": "src/**/*.js",
      "baseDir": "src",
      "command": "./node_modules/.bin/babel ${filePath} --out-file libs/${fileDirRelativeToBase}/${fileBase}.js"
    }
  ],
  "config": <optional configuration options>
}

### Interpolated Variables
Example: `/Users/me/projects/domination/src/stuff/x.js`
* **filePath**: The path of the file relative to your project. (e.g. `src/stuff/x.js`)
* **rootPath**: The root path of the project (e.g. `/Users/me/projects/domination`)
* **fileExt**: The extension of the changed file: (e.g. `.js`)
* **fileBase**: The filename base of the changed file: (e.g. `x`)
* **fileDir**: The directory of the file relative to the project root (e.g. `src/stuff`)
* **fileDirRelativeToBase**: The directory of the file relative to either the baseDir option or the rootPath if no baseDir option is present (e.g. `stuff`)

### Configuration Options
```javascript
{
  commands: [<your command definitions>],
  config: {
    showSuccess: true;
    autohideSuccess: true;
    autohideSuccessTimeout: 1200;
  }
}
```
#### Options
* **showSuccess** (default = true) - If true, shows script success in a nested view
* **autohideSuccess** (default = true) - If true, autohides successful scripts after a timeout period.
* **autohideSuccessTimeout** (default = 1200) - The default timeout in ms, after which the success results will be autohidden.
