var {describe, it} = require("mocha"),
	{assert} = require("chai"),
	sinon = require("sinon"),

	path = require("../index");

describe("pathlib", () => {

	it("base", () => {
		assert.equal(path("path/to/file.ext").base(), "file.ext");
		assert.equal(path("path/to/file.ext").base(".ext"), "file");
	});

	it("ext", () => {
		assert.equal(path("path/to/file.ext").ext(), ".ext");
		assert.equal(path("path/to/file.ext.ext2").ext(), ".ext2");
	});

	it("dir", () => {
		assert.equal(path("path/to/file.ext").dir().path, "path/to");
	});

	it("rename", () => {
		assert.equal(
			path("path/to/file.ext").rename({ext: ".ext2"}).normalize().path,
			path.normalize("path/to/file.ext2")
		);
		assert.equal(
			path("path/to/file.ext").rename({name: "file2"}).normalize().path,
			path.normalize("path/to/file2.ext")
		);
		assert.equal(
			path("path/to/file.ext").rename({base: "another.file"}).normalize().path,
			path.normalize("path/to/another.file")
		);
		assert.equal(
			path("path/to/file.ext").rename({dir: "another/path"}).normalize().path,
			path.normalize("another/path/file.ext")
		);
		if (process.platform == "win32") {
			assert.equal(
				path("path/to/file.ext").rename({root: "D:"}).normalize().path,
				path.normalize("D:\\path\\to\\file.ext")
			);
		}
		
		const renamer = sinon.spy();
		path("/path/to/file.ext").rename(renamer);
		assert(renamer.calledOnce);
		const {root, dir, base, name, ext} = renamer.firstCall.args[0];
		assert.equal(root, "/");
		assert.equal(dir, "/path/to");
		assert.equal(base, "file.ext");
		assert.equal(name, "file");
		assert.equal(ext, ".ext");
		
		assert.equal(
			path("path/to/file.ext").rename(
				({ext}) => ({ext: ".min" + ext})
			).normalize().path,
			path.normalize("path/to/file.min.ext")
		);
	});

	it("isAbsolute", () => {
		assert.isTrue(path("/path").isAbsolute());
		assert.isFalse(path("path").isAbsolute());
	});

	it("mount", () => {
		assert.equal(
			path("path").mount("some/where").path,
			path.normalize("some/where/path")
		);
	});

	it("extend", () => {
		assert.equal(
			path("path").extend("some/where").path,
			path.normalize("path/some/where")
		);
	});

	it("normalize", () => {
		assert.equal(
			path("path/to/file").normalize().path,
			path("path\\to\\file").normalize().path
		);
	});

	it("parse", () => {
		assert.deepEqual(
			path("path/to/file.txt").parse(),
			path.parse("path/to/file.txt")
		);
	});

	it("from", () => {
		assert.equal(
			path("path/to/file.txt").from("path").path,
			path.normalize("to/file.txt")
		);
	});

	it("to", () => {
		assert.equal(
			path("path/to/file.txt").to("path").path,
			path.normalize("../..")
		);
	});

	it("resolve", () => {
		assert.equal(
			path("a").resolve("b").path,
			path.resolve("a", "b")
		);
	});

	it("resolveFrom", () => {
		assert.equal(
			path("a").resolveFrom("b").path,
			path.resolve("b", "a")
		);
	});

	it("nav", () => {
		assert.equal(
			path("path/to/file").nav("another").path,
			path.normalize("path/to/another")
		);
		assert.equal(
			path("path/to/file/").nav("another").path,
			path.normalize("path/to/file/another")
		);
	});

	it("trim", () => {
		assert.equal(path("path/to/dir/").trim().path, "path/to/dir");
		assert.equal(path("/").trim().path, "/");
	});

	it("isDir", () => {
		assert.isTrue(path("path/to/dir/").isDir());
		assert.isTrue(path("path/to/dir/.").isDir());
		assert.isTrue(path("path/to/dir/..").isDir());
		assert.isFalse(path("path/to/dir/...").isDir());
	});

	it("move", () => {
		assert.equal(
			path("path/to/file.ext").move("../hello").path,
			path.normalize("path/hello/file.ext")
		);
	});
	
	it("moveTo", () => {
		assert.equal(
			path("path/to/file.ext").moveTo("some/where/else").path,
			path.normalize("some/where/else/file.ext")
		);
	});
	
	it("isRoot", () => {
		assert.isTrue(path("/").isRoot());
		assert.isTrue(path("C:").isRoot());
		assert.isTrue(path("C:/").isRoot());
		assert.isFalse(path("C/").isRoot());
	});
	
});
