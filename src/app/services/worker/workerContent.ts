function script() {
  let ws = null;

  const socket = (url: string) => {
    ws = new WebSocket(url);

    ws.onopen = (e) => {
      self.postMessage({type: 'open', data: e.type}, e.target);
    };

    ws.onclose = (e) => {
      console.dir(e);
      console.dir(e);
      console.dir(e);
      self.postMessage({type: 'close', data: e.type}, e.target);
    };

    ws.onmessage = (e) => {
      console.dir(e.data);
      self.postMessage({type: 'message', data: e.data}, e.target);
    };

    ws.onerror = (e) => {
      console.dir(e);
      console.dir(e);
      console.dir(e);
      self.postMessage({type: 'error', data: e.type}, e.target);
    };
  }

  const login = (data: string) => {
    ws.send(data);
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

  const closeSocket = () => {
    ws.close();
  };


  self.onmessage = function(e) {
    switch (e.data.type) {
      case 'socket':
        socket(e.data.data.url);
        break;
      case 'login':
        login(e.data.data.data);
        break;
      case 'logout':
        logout(e.data.data);
        break;
      case 'message':
        message(e.data.data);
        break;
      case 'close':
        closeSocket();
        break;
    }
  };
}

const content = ['const main = ', script.toString(), '; main()'].join("");
export default content;
