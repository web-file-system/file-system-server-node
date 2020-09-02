const fs = require("fs");
const Path = require("path");

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
    // console.log("info:", info);

    const stat = await fs.promises.stat(info.path);
    // console.log("stats:", stat);

    info.createTime = stat.birthtime;
    info.updateTime = stat.mtime;
    info.size = stat.size;
    // const stats =
    return info;
}

async function readDirAndFile(path) {
    if (path === undefined || path === null) {
        path = "/";
    }
    const files = await fs.promises.readdir(path, { withFileTypes: true });
    // console.log("files:", files);
    const infos = [];
    for (const dirent of files) {
        if (dirent.isFile() || dirent.isDirectory()) {
            // 只显示文件夹或者文件
            const info = await readFileInfo(path, dirent);
            infos.push(info);
        }
    }
    return infos;
}

async function readDir(path) {
    if (path === undefined || path === null) {
        path = "/";
    }
    const files = await fs.promises.readdir(path, { withFileTypes: true });
    // console.log("files:", files);
    const infos = [];
    for (const dirent of files) {
        if (dirent.isDirectory()) {
            // 只显示文件夹
            const info = await readFileInfo(path, dirent);
            infos.push(info);
        }
    }
    return infos;
}

exports.default = {
    readDirAndFile,
    readDir,
};
