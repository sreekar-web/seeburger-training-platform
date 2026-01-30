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
        width: 1300,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    win.loadURL("http://localhost:3001");
}

ipcMain.handle("publish-mapping", async (_, mappingId) => {
    const raw = fs.readFileSync(MAPPINGS_FILE, "utf-8");
    const mappings = JSON.parse(raw);

    if (!mappings[mappingId]) {
        throw new Error("Mapping not found");
    }

    mappings[mappingId].version += 1;
    mappings[mappingId].lastPublished = new Date().toISOString();

    fs.writeFileSync(
        MAPPINGS_FILE,
        JSON.stringify(mappings, null, 2)
    );

    return mappings[mappingId];
});

app.whenReady().then(createWindow);
