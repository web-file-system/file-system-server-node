const FS = require("fs/promises");
const { GetResponse, CanNotAccess } = require("./ResponseUtil");

async function deleteFile(path) {
    return new Promise((resolve, reject) => {
        FS.access(path)
            .then(() => {
                // 可访问
                FS.unlink(path)
                    .then(() => {
                        resolve(
                            GetResponse({
                                success: true,
                            })
                        );
                    })
                    .catch((error) => {
                        reject(
                            GetResponse({
                                success: false,
                                message: error.code,
                            })
                        );
                    });
            })
            .catch((error) => {
                // 不可访问
                reject(
                    GetResponse({
                        success: false,
                        message: error.code,
                    })
                );
            });
    });
}

async function deleteDir(path) {
    return new Promise((resolve, reject) => {
        FS.access(path)
            .then(() => {
                // 可访问
                FS.rmdir(path, { recursive: true })
                    .then(() => {
                        resolve(
                            GetResponse({
                                success: true,
                            })
                        );
                    })
                    .catch((error) => {
                        reject(
                            GetResponse({
                                success: false,
                                message: error.code,
                            })
                        );
                    });
            })
            .catch(() => {
                // 不可访问
                reject(
                    GetResponse({
                        success: false,
                        message: CanNotAccess,
                    })
                );
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
