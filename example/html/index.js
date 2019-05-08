Terminal.applyAddon(fit);

const [auth, addr] = prompt("ssh", "user:password@127.0.0.1:22").split("@");
const [user, password] = auth.split(":");

const term = new Terminal();
term.open(document.getElementById("main"));

const ws = new WebSocket(`ws://${location.host}/api/ssh?addr=${addr}`);
ws.onopen = () => {
  ws.send(JSON.stringify({ type: "login", data: utoa(user) }));
  ws.send(JSON.stringify({ type: "password", data: utoa(password) }));
  term.on("data", data => {
    const msg = { type: "stdin", data: btoa(data) };
    ws.send(JSON.stringify(msg));
  });
  term.on("resize", e => {
    const msg = { type: "resize", ...e };
    ws.send(JSON.stringify(msg));
  });
  term.fit();
  window.addEventListener("resize", () => term.fit());
};
ws.onmessage = e => {
  const msg = JSON.parse(e.data);
  switch (msg.type) {
    case "stdout":
    case "stderr":
      term.write(atou(msg.data));
  }
};
ws.onerror = console.error;

function atou(encodeString) {
  return decodeURIComponent(escape(atob(encodeString)));
}
function utoa(rawString) {
  return btoa(encodeURIComponent(rawString));
}
