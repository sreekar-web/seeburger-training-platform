const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("mappingAPI", {
    publishMapping: (mappingId) =>
        ipcRenderer.invoke("publish-mapping", mappingId)
});
