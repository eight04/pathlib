pathlib
=======

A node module to make path manipulation easier. Built on top of the builtin `path` module.

Installation
------------
```
npm install -S pathlib
```

Usage
-----
```javascript
var path = require("pathlib");

// find relative path
path("a/b/c").to("a").path   // "../.."
path("a/b/c").from("a").path // "b/c"

// move file tree
path("base/path/to/file.ext")
	.from("base").mount("other/place").path // "other/place/path/to/file.ext"
	
// move file
path("path/to/file.ext").move("subdir").path // "path/to/subdir/file.ext"

// get parent directory
path("path/to/file.ext").dir().path // "path/to"

// url join
path("path/to/file").nav("other/").nav("file").path // "path/to/other/file"

// members of original path module are copied.
path.join("a", "b", "c"); // "a/b/c"
```

API reference
-------------

This module exports a `createPath` function.

### createPath(path: string): Path

Create a Path object.

### createPath.Path: Path class

### createPath.unwrap(path: Path|Array|object|string): Array|object|string

Unwrap a Path object, return its .path property.
If calling with an array, return a new array that each element is unwrapped.
If calling with an object, unwrap all enumerable properties.

### Path: class

#### constructor(path: string|Path)

A string to initiate the path.

#### Path.base(): string

Return basename.

#### Path.ext(): string

Return extension name.

#### Path.dir(): new Path

Return the path of parent folder.

#### Path.rename(option: Object|function): new Path

If calling with an object, it looks for `root`, `dir`, `base`, `name`, `ext` properties to decide the new name.

```
.rename({ext: ".txt"})	 // change extension to ".txt"
.rename({name: "file2"}) // change name to "file2"
.rename({root: "D:"})    // change root to "D:"
.rename({name: "hello", ext:".world"}) // rename multiple parts at once
```

This method also accept a function, which should accept a [PathParseResult](https://nodejs.org/api/path.html#path_path_parse_path) and return a option object.

#### Path.isAbsolute(): boolean

Check if it is an absolute path.

#### Path.mount(...base: string|Path): new Path

Mount current path on base.

#### Path.extend(...path: string|path): new Path

Concat all path to the current.

#### Path.normalize(): new Path

Normalize the path separator. Resolve ".." and ".".

#### Path.parse(): ParseResult

See [`nodePath.parse()`](https://nodejs.org/api/path.html#path_path_parse_path).

#### Path.from(base: string|Path): new Path

Return path relative to base.

#### Path.to(target: string|Path): new Path

Return a relative path which can resolves to target from current path.

#### Path.resolve(...path: string|Path): new Path

Resolve path base on self.

#### Path.resolveFrom(...path: string|Path): new Path

Resolve, but start from path.

#### Path.nav(path: string|Path): new Path

URL join. Its behavior depends on `.isDir()`.

#### Path.isDir(): boolean

Test if the path ends with "/" or "\".

#### Path.trim(): new Path

Trim trailing slash.

#### Path.move(path: string|Path): new Path

Util method to move file along the path to other folder.

#### Path.moveTo(path: string|Path): new Path

Util method to move file to other path. It works a slightly different than `.move`.
```
path("a/b/c.dat").move("d").path;   // "a/b/d/c.dat"
path("a/b/c.dat").moveTo("d").path; // "d/c.dat"
```

#### Path.isRoot(): boolean

Return true if current path is a root path.

Changelog
---------

* 0.1.2 (Jan 21, 2017)

	- Add Path.isRoot.

* 0.1.1 (Jan 18, 2017)

	- Copy original path properties into createPath function.
	- Add Path.moveTo.

* 0.1.0 (Jan 18, 2017)

    - First release.
