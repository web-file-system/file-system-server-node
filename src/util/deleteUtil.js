const FS = require("fs/promises");
const {
    SuccessCode,
    SuccessMessage,
    FailCode,
    FailMessage,
} = require("./ResponseUtil");

async function deleteFile(path) {
    return new Promise((resolve, reject) => {
        FS.access(path)
            .then(() => {
                // 可访问

                FS.unlink(path)
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

async function deleteDir(path) {
    return new Promise((resolve, reject) => {
        FS.access(path)
            .then(() => {
                // 可访问
                FS.rmdir(path)
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
module.exports = { deleteFile, deleteDir };
