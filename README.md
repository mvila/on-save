[![Build Status](https://travis-ci.org/darthtrevino/savey-wavey.svg?branch=master)](https://travis-ci.org/darthtrevino/savey-wavey)

# savey-wavey

`apm install savey-wavey`

An atom plugin for triggering shell scripts on save events.

## Usage
Create an `.on-save.json` file at the root of you project.

For example, if you want to babelify every `.js` file from `src` to `lib`:

```javascript
{
  "commands": [
    {
      "watch": "src/**/*.js",
      "base": "src",
      "command": "./node_modules/.bin/babel ${path} --out-file libs/${dir}/${name}.js"
    }
  ],
  "config": <optional configuration options>
}
```

### Interpolated Variables
Example: `/Users/me/projects/domination/src/widgets/x.js`

* **project**: The root path of the project (e.g. `/Users/me/projects/domination`)
* **path**: The path of the file relative to your project. (e.g. `src/widgets/x.js`)
* **path_abs**: The absolute path of the changed file (e.g. `/Users/me/projects/domination/src/widgets/x.js`)
* **ext**: The extension of the changed file: (e.g. `.js`)
* **name**: The base filename, without extension, of the changed file: (e.g. `x`)
* **dir**: The directory of the file relative to either the baseDir option or the rootPath if no baseDir option is present (e.g. `stuff`)

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
