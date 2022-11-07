const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { stdin: input, stdout: output } = require("process");

const rl = readline.createInterface({ input, output });

const writeableStream = fs.createWriteStream(path.join(__dirname, "text.txt"), {
    flags: "a",
});

const exit = (data) => {
    if (data === "exit") {
        process.stdout.write("Thank you! Have a nice day!\n");
        writeableStream.end();
        rl.close();
        return false;
    }
    return true;
};

rl.question("Please, input some text: \n", (answer) => {
    if (exit(answer)) {
        writeableStream.write(answer + "\n");
    }
});

rl.addListener("line", (input) => {
    if (exit(input)) {
        writeableStream.write(input + "\n");
    }
});

rl.on("SIGINT", () => {
    exit("exit");
});
