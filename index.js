var path = require("path");

class Path {
	constructor(p) {
		p = unwrap(p);
		this.path = p;
	}
	base(ext) {
		return path.basename(this.path, ext);
	}
	ext() {
		return path.extname(this.path);
	}
	dir() {
		return new Path(path.dirname(this.path));
	}
	rename(o) {
		var r = path.parse(this.path);
		if (typeof o == "function") {
			o = o(r);
			if (o) {
				unwrap(o);
			}
		}
		if (!o) {
			return new Path(this.path);
		}
		Object.assign(r, o);
		if (!o.base) {
			delete r.base;
		}
		if (!o.dir && o.root) {
			r.dir = path.join(o.root, path.relative(r.root, r.dir));
		}
		return new Path(path.format(r));
	}
	isAbsolute() {
		return path.isAbsolute(this.path);
	}
	mount(...p) {
		p = unwrap(p);
		return new Path(path.join(...p, this.path));
	}
	extend(...p) {
		p = unwrap(p);
		return new Path(path.join(this.path, ...p));
	}
	normalize() {
		return new Path(path.normalize(this.path));
	}
	parse() {
		return path.parse(this.path);
	}
	from(p) {
		p = unwrap(p);
		return new Path(path.relative(p, this.path));
	}
	to(p) {
		p = unwrap(p);
		return new Path(path.relative(this.path, p));
	}
	resolve(...p) {
		p = unwrap(p);
		return new Path(path.resolve(this.path, ...p));
	}
	resolveFrom(...p) {
		p = unwrap(p);
		return new Path(path.resolve(...p, this.path));
	}
	nav(p) {
		p = unwrap(p);
		if (this.isDir()) {
			return new Path(path.join(this.path, p));
		}
		return new Path(path.join(path.dirname(this.path), p));
	}
	trim() {
		if (!this.isRoot() && /[\\/]$/.test(this.path)) {
			return new Path(this.path.slice(0, -1));
		}
		return new Path(this.path);
	}
	isDir() {
		return /[\\/]\.{0,2}$/.test(this.path);
	}
	move(p) {
		p = unwrap(p);
		return new Path(path.join(path.dirname(this.path), p, path.basename(this.path)));
	}
	moveTo(p) {
		p = unwrap(p);
		return new Path(path.join(p, path.basename(this.path)));
	}
	isRoot() {
		return path.parse(this.path).base == "";
	}
}

function createPath(p) {
	return new Path(p);
}

function unwrap(arg) {
	if (arg instanceof Path) {
		return arg.path;
	}
	if (typeof arg == "string") {
		return arg;
	}
	if (Array.isArray(arg)) {
		return arg.map(unwrap);
	}
	for (const key of Object.keys(arg)) {
		arg[key] = unwrap(arg[key]);
	}
	return arg;
}

createPath.unwrap = unwrap;
createPath.Path = Path;

Object.keys(path).forEach(key => {
	createPath[key] = path[key];
});

module.exports = createPath;
