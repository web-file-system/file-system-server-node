const FS = require("fs");
const { CanNotAccess, GetResponse } = require("./ResponseUtil");
const AdmZip = require("adm-zip");
const _ = require("lodash");
const Path = require("path");

const Zip = new AdmZip();

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
                        Zip.addLocalFile(input);
                        Zip.writeZip(output, (error) => {
                            if (error) {
                                const error = GetResponse({
                                    success: false,
                                });
                                reject(error);
                            } else {
                                const res = GetResponse({
                                    success: true,
                                });
                                resolve(res);
                            }
                        });
                    } else {
                        Zip.addLocalFolder(input);
                        Zip.writeZip(output, (error) => {
                            if (error) {
                                const error = GetResponse({
                                    success: false,
                                });
                                reject(error);
                            } else {
                                const res = GetResponse({
                                    success: true,
                                });
                                resolve(res);
                            }
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
                    try {
                        const zip = new AdmZip(input);
                        const zipEntries = zip.getEntries();
                        console.log(zipEntries);
                        if (zipEntries.length > 1) {
                            zip.extractAllTo(output, true);
                        } else {
                            const name = Path.dirname(input);
                            console.log(name);
                            zip.extractAllTo(name, true);
                        }
                        resolve(
                            GetResponse({
                                success: true,
                            })
                        );
                    } catch (e) {
                        console.log(e);
                        reject(
                            GetResponse({
                                success: false,
                            })
                        );
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
module.exports = {
    zip,
    unzip,
};
