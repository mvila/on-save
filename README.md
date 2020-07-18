<p align="center">
  <br />
  <br />
  <img src="https://s3.amazonaws.com/on-save/on-save-logo-with-tagline.svg" alt="on-save: Run a shell command when you save a file" width="451" height="65" />
  <br />
</p>

## Caution

**This project is in maintenance mode, and it will not get any new features.**

## Installation

```
apm install on-save
```

## Usage

Create an `.on-save.json` file at the root of your project (or anywhere in the path of the files you want to watch).

For example, if you want to babelify every `.js` file from `src` to `dist`, the `.on-save.json` file content might be something like:

```json
[
  {
    "srcDir": "src",
    "destDir": "dist",
    "files": "**/*.js",
    "command": "babel ${srcFile} --out-file ${destFile}"
  }
]
```

## Configuration file

The content of the `.on-save.json` file must be an array of objects with the following properties:

- `srcDir` _(default to `.on-save.json`'s directory)_: The source directory.
- `destDir` _(default to `srcDir`)_: The destination directory.
- `files`: The files you want to track. You can use a glob (see [minimatch](https://github.com/isaacs/minimatch)), or an array of globs.
- `command`: The command to execute. You can use these variables:
  - `${srcFile}`: The input file.
  - `${destFile}`: The output file.
  - `${destFileWithoutExtension}`: The output file without the extension.
- `showOutput` _(default to `false`)_: A boolean indicating whether the output stream (stdout) should be displayed or not.
- `showError` _(default to `true`)_: A boolean indicating whether the error stream (stderr) should be displayed or not.

## License

MIT
