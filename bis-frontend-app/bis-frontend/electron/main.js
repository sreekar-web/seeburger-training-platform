const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const MAPPINGS_FILE = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "backend",
    "data",
    "mappings.json"
);

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadURL("http://localhost:3000");
}

ipcMain.handle("get-latest-mapping", async (_, mappingId) => {
    const raw = fs.readFileSync(MAPPINGS_FILE, "utf-8");
    const mappings = JSON.parse(raw);

    if (!mappings[mappingId]) {
        throw new Error("Mapping not found");
    }

    return mappings[mappingId];
});

app.whenReady().then(createWindow);
