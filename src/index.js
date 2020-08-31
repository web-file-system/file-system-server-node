const Koa = require("koa");
const mount = require("koa-mount");
const URL = require("url");
const querystring = require("querystring");
const responseTemplate = require("./util/responseTemplate");
const app = new Koa();
const fs = require("fs");
const path = require("path");
const cors = require("@koa/cors");

app.use(cors());

app.use(
    mount("/favicon.ico", (ctx) => {
        ctx.status = 200;
    })
);
app.use(
    mount("/api", async (ctx) => {
        const request = ctx.request;
        const response = ctx.response;

        const url = URL.parse(request.url);
        const pathname = url.pathname;

        if (pathname === "/list") {
            const files = await readDir();
            console.log("files", files);

            responseTemplate.success.data = files;
            response.body = responseTemplate.success;
        }
    })
);

app.listen(80);

async function readDir() {
    const files = await fs.promises.readdir(__dirname, { withFileTypes: true });
    console.log("promises:", files);
    const infos = [];
    files.forEach((dirent) => {
        console.log("dirent:", dirent.isFile());
        const info = readFileInfo(dirent);
        infos.push(info);
    });
    return infos;
}

function readFileInfo(dirent) {
    console.log("readFileInfo:", dirent);
    const info = {
        isFile: false,
        isDir: false,
        name: null,
    };

    info.isFile = dirent.isFile();
    info.isDir = dirent.isDirectory();
    info.name = dirent.name;
    info.path = path.posix.join(__dirname, dirent.name);
    // const dirName = __dirname;
    // console.log("dirName:", dirName);
    // const filePath = path.join(dirName, fileName);
    // console.log("filePath:", filePath);
    // const fileInfo = await fs.promises.readdir(filePath);
    console.log("info:", info);
    return info;
}

readDir();
