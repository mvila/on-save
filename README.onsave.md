<p align="center">
  <br />
  <br />
  <img src="https://s3.amazonaws.com/on-save/on-save-logo-with-tagline.svg" alt="on-save: Run a shell command when you save a file" width="451" height="65" />
  <br />
</p>

## Installation

```
apm install savey-wavey
```

## Usage

Create an `.on-save.json` file at the root of you project.

For example, if you want to babelify every `.js` file from `src` to `lib`:

```javascript
[
  {
    "srcDir": "src",
    "destDir": "lib",
    "files": "**/*.js",
    "command": "babel ${srcFile} --out-file ${destFile}"
  }
]
```

In case your Babel CLI is local, maybe you would do something like this:

```javascript
[
  {
    "srcDir": "src",
    "destDir": "lib",
    "files": "**/*.js",
    "command": "./node_modules/.bin/babel ${srcFile} --out-file ${destFile}"
  }
]
```

Finally, if you use [nvm](https://github.com/creationix/nvm) for your Node installation you would probably need a package like [000-project-shell-env](https://atom.io/packages/000-project-shell-env).

## Configuration file

To use **on-save**, create an `.on-save.json` file at the root of your project. The content should be an array containing objects with the following properties:

- `srcDir` *(default: `'.'`)*: The source directory.
- `destDir` *(default: `'.'`)*: The destination directory.
- `files`: The files you want to track. You can use a glob, see [minimatch](https://github.com/isaacs/minimatch).
- `command`: The command to execute. You can use these variables:
  - `${srcFile}`: The input file.
  - `${destFile}`: The output file.
  - `${destFileWithoutExtension}`: The output file without the extension.

## License

MIT
