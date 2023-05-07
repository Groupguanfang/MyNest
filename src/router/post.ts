import { Application } from "express-serve-static-core";
import { join } from "path";
import { IinitParameter, initParameter } from "src/common/parameter";
import {
  HTTP_KEY,
  IControllerMetadata,
  IMethodMetadata,
} from "src/decorator/http.decorator";

export function initPOST(
  prototype: string[],
  element: string,
  controllerMetadata: IControllerMetadata,
  app: Application
) {
  const methodPOSTData: IMethodMetadata = Reflect.getMetadata(
    HTTP_KEY.Post,
    prototype[element]
  );

  const { info, fn } = methodPOSTData;

  // url路径拼接
  const urlPath = join("/" + controllerMetadata.path, info).replace(/\\/g, "/");

  // 解析类函数内方法的参数
  const metadata = initParameter(controllerMetadata);
  // 装载GET方法
  PostMethod(fn, urlPath, app, metadata);
}

function PostMethod(
  fn: Function,
  urlPath: string,
  app: Application,
  { queryMetadata, paramMetadata, bodyMetadata }: IinitParameter
) {
  app.post(urlPath, (req, res) => {
    // 即将调用的所有args
    const args = [];
    // 如果存在
    if (queryMetadata && queryMetadata.name === fn.name) {
      args[queryMetadata.index] = req.query;
    }
    if (paramMetadata && paramMetadata.name === fn.name) {
      args[paramMetadata.index] = req.params;
    }
    if (bodyMetadata && bodyMetadata.name === fn.name) {
      args[bodyMetadata.index] = req.body;
    }

    // 直接执行函数
    const ret = fn(...args);
    // 发送请求
    res.send(ret);
  });
}