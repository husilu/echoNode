const Koa = require("koa");
const path = require("path");
const koaBody = require("koa-body");
const koaStatic = require("koa-static");
const parameter = require("koa-parameter");
const error = require("koa-json-error");
const mongoose = require("mongoose");
const routing = require("./routes");
const cors = require('koa2-cors');
const app = new Koa();
const { connectionStr } = require("./config");
mongoose.connect(  // 连接mongodb
  connectionStr,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("mongodb 连接成功了！")
);
mongoose.connection.on("error", console.error);

app.use(koaStatic(path.join(__dirname, "public")));  // 静态资源
app.use(  // 错误处理
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === "production" ? rest : { stack, ...rest }
  })
);
app.use(  // 处理post请求和图片上传
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, "/public/uploads"),
      keepExtensions: true
    }
  })
);
app.use(cors());
app.use(parameter(app));  // 参数校验
routing(app);  // 路由处理
app.listen(3000, () => console.log("程序启动在3000端口了"));