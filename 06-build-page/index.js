const fs = require("fs");
const path = require("path");

fs.mkdir(path.join(__dirname, "project-dist"), { recursive: true }, () => {});

// ==========COPY ASSETS=========
const copy = async (src, target) => {
    await fs.mkdir(target, { recursive: true }, () => {});
    fs.readdir(src, { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
            let srcPath = path.join(src, file.name);
            let targetPath = path.join(target, file.name);
            if (file.isDirectory()) {
                copy(srcPath, targetPath);
            } else {
                fs.copyFile(srcPath, targetPath, () => {});
            }
        });
    });
};

const src = path.join(__dirname, "assets");
const target = path.join(__dirname, "project-dist");

const copyFolder = async (src, target) => {
    await fs.mkdir(target, { recursive: true }, () => {});
    const newFolder = path.join(target, "assets");
    await copy(src, newFolder);
};

copyFolder(src, target);

// ===========STYLES========
const styles = fs.createWriteStream(
    "./06-build-page/project-dist/style.css",
    "utf-8"
);

fs.readdir(
    path.join(__dirname, "styles"),
    { withFileTypes: true },
    (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
            fs.stat(path.join(__dirname, "styles", file.name), (err, stats) => {
                if (err) throw err;

                if (stats.isFile() && path.extname(file.name) === ".css") {
                    const input = fs.createReadStream(
                        path.join(__dirname, "styles", file.name)
                    );

                    input.on("data", (partData) =>
                        styles.write(partData + "\n")
                    );
                }
            });
        });
        console.log("Styles Done!");
    }
);

// =============HTML============
fs.readFile(path.join(__dirname, "template.html"), "utf-8", (err, data) => {
    if (err) throw err;

    let template = data;
    const reg = /{{(\w+)}}/;
    let tag = template.match(reg);
    let tagName = tag[1];

    clearTag();

    // ===============CLEAR TAGS=============
    function clearTag() {
        fs.readFile(
            path.join(__dirname, "components", `${tagName}.html`),
            "utf-8",
            (err, el) => {
                if (err) throw err;
                if (!el) {
                    template = template.replace(reg, "");
                } else {
                    template = template.replace(reg, el);
                }

                tag = template.match(reg);

                if (tag === null) {
                    fs.writeFile(
                        path.join(__dirname, "project-dist", "index.html"),
                        template,
                        () => {}
                    );
                } else {
                    tagName = tag[1];
                    clearTag();
                }
            }
        );
    }
    console.log("HTML Done!");
});
