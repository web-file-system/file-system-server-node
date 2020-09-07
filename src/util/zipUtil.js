const FS = require("fs");
const { CanNotAccess, GetResponse } = require("./ResponseUtil");
const Compressing = require("compressing");
const _ = require("lodash");

function zip({ input, output, type }) {
    return new Promise((resolve, reject) => {
        if (input === undefined) {
            reject(
                GetResponse({
                    success: false,
                    message: "缺少 path 参数",
                })
            );
        } else {
            FS.promises
                .access(input)
                .then(() => {
                    // 可访问
                    if (output === null || output === undefined) {
                        output = `${input}.zip`;
                    }
                    if (type === "file") {
                        Compressing.zip
                            .compressFile(input, output)
                            .then(() => {
                                const res = GetResponse({
                                    success: true,
                                });
                                resolve(res);
                            })
                            .catch((err) => {
                                console.log(err);
                                const error = GetResponse({
                                    success: false,
                                });
                                reject(error);
                            });
                    } else {
                        Compressing.zip
                            .compressDir(input, output)
                            .then(() => {
                                const res = GetResponse({
                                    success: true,
                                });
                                resolve(res);
                            })
                            .catch(() => {
                                const error = GetResponse({
                                    success: false,
                                });
                                reject(error);
                            });
                    }
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
        }
    });
}

function unzip({ input, output }) {
    return new Promise((resolve, reject) => {
        if (input === undefined) {
            reject(
                GetResponse({
                    success: false,
                    message: "缺少 path 参数",
                })
            );
        } else if (_.endsWith(input, ".zip") === false) {
            reject(
                GetResponse({
                    success: false,
                    message: "非 zip 文件",
                })
            );
        } else {
            FS.promises
                .access(input)
                .then(() => {
                    // 可访问
                    Compressing.zip
                        .uncompress(input, output)
                        .then(() => {
                            resolve(
                                GetResponse({
                                    success: true,
                                })
                            );
                        })
                        .catch((err) => {
                            reject(
                                GetResponse({
                                    success: false,
                                    message: CanNotAccess,
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
        }
    });
}
module.exports = {
    zip,
    unzip,
};
