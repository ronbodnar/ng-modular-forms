const fs = require("fs");

const version = process.env.VERSION.replace(/^v/, "");

if (!version) {
  throw new Error("VERSION env var is required");
}

const pkgs = ["./dist/core/package.json", "./dist/material/package.json"];

for (const pkgPath of pkgs) {
  const json = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  json.version = version;

  if (json.peerDependencies?.["@ng-modular-forms/core"]) {
    json.peerDependencies["@ng-modular-forms/core"] = `^${version}`;
  }

  fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2));
}
