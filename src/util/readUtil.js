const fs = require("fs");
const Path = require("path");
const { GetResponse } = require("./ResponseUtil");

async function readFileInfo(path, dirent) {
    // console.log("readFileInfo:", dirent);
    const info = {
        isFile: false,
        isDir: false,
        name: null,
        createTime: null,
        updateTime: null,
        size: null,
    };

    info.isFile = dirent.isFile();
    info.isDir = dirent.isDirectory();
    info.name = dirent.name;
    info.path = Path.posix.join(path, dirent.name);
    info.isZip = Path.posix.extname(info.path) === ".zip";
    // console.log("info:", info);

    const stat = await fs.promises.stat(info.path);
    // console.log("stats:", stat);

    info.createTime = stat.birthtime;
    info.updateTime = stat.mtime;
    info.size = stat.size;
    // const stats =
    return info;
}

function readDirAndFile(path) {
    return new Promise((resolve, reject) => {
        if (path === undefined || path === null) {
            const res = GetResponse({
                success: false,
                message: "缺少 path 参数",
            });
            reject(res);
        }

        fs.promises
            .readdir(path, { withFileTypes: true })
            .then(async (files) => {
                const infos = [];
                for (const dirent of files) {
                    if (dirent.isFile() || dirent.isDirectory()) {
                        // 只显示文件夹或者文件
                        const info = await readFileInfo(path, dirent);
                        infos.push(info);
                    }
                }
                const res = GetResponse({
                    success: true,
                    data: infos,
                });
                resolve(res);
            })
            .catch((error) => {
                console.error("readDirAndFile:", error);
                const res = GetResponse({
                    success: false,
                });
                reject(res);
            });
    });
}

module.exports = {
    readDirAndFile,
};
