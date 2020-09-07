const FS = require("fs/promises");
const {
    SuccessCode,
    SuccessMessage,
    FailCode,
    FailMessage,
} = require("./ResponseUtil");
const { zip } = require("./zipUtil");

function copyFile(input) {
    return new Promise((resolve, reject) => {
        FS.access(input)
            .then(() => {
                // 可访问
                const names = input.split(".");
                let output = null;
                if (names.length < 2) {
                    output = `${names[0]}的备份`;
                } else {
                    const outputName = `${names[0]}的备份`;
                    names.splice(0, 1, outputName);
                    output = names.join(".");
                }
                FS.copyFile(input, output)
                    .then(() => {
                        const res = {
                            code: SuccessCode,
                            message: SuccessMessage,
                        };
                        resolve(res);
                    })
                    .catch(() => {
                        const error = {
                            code: FailCode,
                            message: FailMessage,
                        };
                        reject(error);
                    });
            })
            .catch(() => {
                // 不可访问
                const error = {
                    code: FailCode,
                    message: FailMessage,
                };
                reject(error);
            });
    });
}

function copyDir(input) {
    return new Promise((resolve, reject) => {
        FS.access(input)
            .then(() => {
                // 可访问
                let output = `${input}的备份.zip`;
                zip({ input, output })
                    .then(() => {
                        const res = {
                            code: SuccessCode,
                            message: SuccessMessage,
                        };
                        resolve(res);
                    })
                    .catch(() => {
                        const error = {
                            code: FailCode,
                            message: FailMessage,
                        };
                        reject(error);
                    });
            })
            .catch(() => {
                // 不可访问
                const error = {
                    code: FailCode,
                    message: FailMessage,
                };
                reject(error);
            });
    });
}
module.exports = {
    copyFile,
    copyDir,
};
