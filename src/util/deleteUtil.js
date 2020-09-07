const FS = require("fs/promises");
const {
    SuccessCode,
    SuccessMessage,
    FailCode,
    FailMessage,
    GetResponse,
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

function deleteDirOrFile({ path, type }) {
    return new Promise((resolve, reject) => {
        if (path === undefined) {
            reject(
                GetResponse({
                    success: false,
                    message: "缺少 path 参数",
                })
            );
        } else if (type === undefined) {
            reject(
                GetResponse({
                    success: false,
                    message: "缺少 type 参数",
                })
            );
        } else {
            if (type === "file") {
                //file
                deleteFile(path)
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } else {
                //dir
                deleteDir(path)
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        }
    });
}
module.exports = { deleteFile, deleteDir, deleteDirOrFile };
