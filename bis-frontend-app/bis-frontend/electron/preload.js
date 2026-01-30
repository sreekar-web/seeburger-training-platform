const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("mappingAPI", {
    getLatestMapping: (mappingId) =>
        ipcRenderer.invoke("get-latest-mapping", mappingId)
});
