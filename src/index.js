const Koa = require("koa");
const mount = require("koa-mount");
const URL = require("url");
const responseTemplate = require("./util/responseTemplate");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const fs = require("fs");
const Path = require("path");
const cors = require("@koa/cors");

app.use(bodyParser());

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
        // console.log("request:", request);
        // console.log("request-body:", request.body);

        const url = URL.parse(request.url);
        const pathname = url.pathname;

        const queryObj = request.body;
        // console.log("queryObj:", queryObj);

        if (pathname === "/list") {
            const { path } = queryObj;
            if (path === undefined) {
                responseTemplate.fail.message = "缺少 path 参数";
                response.body = responseTemplate.fail;
            } else {
                const files = await readDir();
                // console.log("files2", files);

                responseTemplate.success.data = files;
                response.body = responseTemplate.success;
            }
        }
    })
);

app.listen(80);

async function readDir() {
    const files = await fs.promises.readdir(__dirname, { withFileTypes: true });
    // console.log("promises:", files);
    const infos = [];
    for (const dirent of files) {
        const info = await readFileInfo(dirent);
        infos.push(info);
    }
    return infos;
}

async function readFileInfo(dirent) {
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
    info.path = Path.posix.join(__dirname, dirent.name);
    // console.log("info:", info);

    const stat = await fs.promises.stat(info.path);
    // console.log("stats:", stat);

    info.createTime = stat.birthtime;
    info.updateTime = stat.mtime;
    info.size = stat.size;
    // const stats =
    return info;
}

readDir();
