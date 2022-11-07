const fs = require("fs");
const path = require("path");
const folder = path.join(__dirname, "files");
const folderCopy = path.join(__dirname, "files-copy");

function callback(err) {
    if (err) throw err;
    console.log("source was copied to destination");
}

async function copyFolder() {
    await fs.promises.rm(folderCopy, { recursive: true, force: true });

    fs.mkdir(folderCopy, { recursive: true }, (err) => {
        if (err) throw err;
    });

    fs.readdir(folder, (err, data) => {
        if (err) throw err;
        data.forEach((file) => {
            fs.copyFile(
                path.join(__dirname, "files", file),
                path.join(__dirname, "files-copy", file),
                callback
            );
        });
    });
}
copyFolder();
