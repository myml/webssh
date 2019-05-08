# 服务器端文档

## 快速开始

使用相同 ID,分别添加 net.conn,websocket.conn

```go
webssh := NewWebSSH()
...
conn, _ := net.Dial("tcp", "127.0.0.1:22")
wssh.AddSSHConn("$uuid", conn)
...
ws, _ := websocket.Upgrade(w, r, nil, 512, 512)
wssh.AddWebsocket("$uuid", ws)
```

# 客户端文档

## 消息类型

```go
type messageType string
const (
	messageTypeStdin     = "stdin"
	messageTypeStdout    = "stdout"
	messageTypeStderr    = "stderr"
	messageTypeResize    = "resize"
	messageTypeLogin     = "login"
	messageTypePassword  = "password"
	messageTypePublickey = "publickey"
)
type message struct {
	Type messageType `json:"type"`
	Data []byte      `json:"data"`
	Cols int         `json:"cols"`
	Rows int         `json:"rows"`
}
```

## 消息协议

1. 登录 `{type:"login",data:"$username"}`
1. 验证 `{type:"password",data:"$password"}`
1. 窗口大小调整 `{type:"resize",cols:40,rows:80}`
1. 标准流数据  
    `{type:"stdin",data:"$data"}`
   `{type:"stdout",data:"$data"}`
   `{type:"stderr",data:"$data"}`  
   客户端发送 stdin,接收 stdout,stderr

## Data 数据

消息的 data 数据使用 base64 编码传输，JavaScript 的`atob & btoa`可用于 base64 编码，但对 utf8 有兼容性问题，要使用`decodeURIComponent & encodeURIComponent`做包裹,以下是实现

```javascript
function atou(encodeString) {
  return decodeURIComponent(escape(atob(encodeString)));
}
function utoa(rawString) {
  return btoa(encodeURIComponent(rawString));
}
```
