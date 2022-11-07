const fs = require("fs");
const path = require("path");
const output = fs.createWriteStream(
    "./05-merge-styles/project-dist/bundle.css",
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
                        output.write(partData + "\n")
                    );
                }
            });
        });
    }
);
