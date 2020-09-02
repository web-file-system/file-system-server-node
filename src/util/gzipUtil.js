const FS = require("fs/promises");
const {
    SuccessCode,
    SuccessMessage,
    FailCode,
    FailMessage,
} = require("./ResponseUtil").default;
const Compressing = require("compressing");

function zip(input, output, isFile) {
    return new Promise((resolve, reject) => {
        FS.access(input)
            .then(() => {
                // 可访问
                if (output === null || output === undefined) {
                    output = `${input}.zip`;
                }
                if (isFile === true) {
                    Compressing.zip
                        .compressFile(input, output)
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
                } else {
                    Compressing.zip
                        .compressDir(input, output)
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
                }
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

function unzip(input, output) {
    return new Promise((resolve, reject) => {
        FS.access(input)
            .then(() => {
                // 可访问
                Compressing.zip
                    .uncompress(input, output)
                    .then(() => {
                        const res = {
                            code: SuccessCode,
                            message: SuccessMessage,
                        };
                        resolve(res);
                    })
                    .catch((err) => {
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
exports.default = {
    zip,
    unzip: unzip,
};
