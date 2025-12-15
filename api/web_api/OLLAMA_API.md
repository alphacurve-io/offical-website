# Ollama RAG API 使用说明

## 功能说明

实现了连接 Ollama 的 RAG (Retrieval-Augmented Generation) API，可以根据网站信息和预设文件回答用户问题。

## API 端点

### POST `/api/chat`

接收用户问题并返回 AI 生成的回答。

**请求格式：**
```json
{
  "question": "你的问题"
}
```

**响应格式：**
```json
{
  "answer": "AI 生成的回答"
}
```

## 环境变量配置

需要在 GitHub Actions Repository Secrets 中设置以下环境变量：

- `OLLAMA_BASE_URL`: Ollama API 的基础 URL（例如：`https://ollama.com`）
- `OLLAMA_API_KEY`: Ollama API 密钥（可选，如果 Ollama 需要认证）
- `OLLAMA_MODEL`: 使用的模型名称（默认：`gpt-oss:120b`）
- `ALLOWED_DOMAINS`: 允许调用 API 的域名列表，用逗号分隔（例如：`alphacurve.io,www.alphacurve.io`，默认：`alphacurve.io,www.alphacurve.io`）

## 安全说明

API 实施了域名白名单验证，只有来自允许域名的请求才能调用 `/api/chat` 端点。验证会检查：
- `Origin` 请求头
- `Referer` 请求头（作为备用）
- `Host` 请求头（如果没有 Origin 或 Referer）

如果请求来源不在白名单中，API 会返回 `403 Forbidden` 错误。

**注意：** 为了便于服务器端测试，以下情况会自动允许：
- `localhost` 或 `127.0.0.1` 的请求（服务器端直接调用）
- 没有 Origin/Referer 头且 Host 是 localhost 的请求（curl 等工具的直接调用）

因此，你可以在服务器端通过以下方式测试 API：
```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Alphacurve 提供什麼服務？"}'
```

## RAG 上下文文件

预设的 RAG 上下文文件位于 `api/web_api/rag_context.txt`，部署时会自动复制到 `/usr/local/bin/rag_context.txt`。

你可以编辑这个文件来更新 RAG 的上下文内容。

## 使用示例

```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Alphacurve 提供什麼服務？"}'
```

