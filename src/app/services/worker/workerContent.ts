function script() {
  let ws = null;

  const login = (url: string, data: string) => {
    ws = new WebSocket(url);

    ws.onopen = (e) => {
      ws.send(data);
      // self.postMessage({type: 'open', event: e.type}, e.target);
    };

    ws.onclose = (e) => {
      console.dir(e);
      console.dir(e);
      console.dir(e);
      // self.postMessage({type: 'close', event: e.type}, e.target);
    };

    ws.onmessage = (e) => {
      console.dir(e.data);
      self.postMessage({type: 'message', event: e.data}, e.target);
    };

    ws.onerror = (e) => {
      console.dir(e);
      console.dir(e);
      console.dir(e);
      // self.postMessage({type: 'error', event: e.type}, e.target);
    };

  };

  const logout = (data: string) => {
    if(self.closed === false) {
      ws.send(data);
      self.close();
    }
  };

  const message = (data: string) => {
    ws.send(data);
  };


  self.onmessage = function(e) {
    switch (e.data.type) {
      case 'login':
        login(e.data.data.url, e.data.data.data);
        break;
      case 'logout':
        logout(e.data.data);
        break;
      case 'message':
        message(e.data.data);
        break;
    }
  };
}

const content = ['const main = ', script.toString(), '; main()'].join("");
export default content;
