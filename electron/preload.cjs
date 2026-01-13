const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // future IPC hooks go here
});
