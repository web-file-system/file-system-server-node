const FS = require("fs/promises");

async function deleteFile(path) {
    const error = await FS.unlink(path);
    console.log("deleteFile:", error);
    if (error) {
        return error;
    } else {
        return true;
    }
}

async function deleteDir(path) {
    const error = await FS.rmdir(path);
    console.log("deleteDir:", error);
    if (error) {
        return error;
    } else {
        return true;
    }
}
exports.default = { deleteFile, deleteDir };
