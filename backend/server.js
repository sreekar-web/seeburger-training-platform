import express from "express";
import cors from "cors";

import mappingsRouter from "./routes/mappings.js";
import messageRoutes from "./routes/messages.js";
import runtimeRoutes from "./routes/runtime.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/mappings", mappingsRouter);
app.use("/api/messages", messageRoutes);
app.use("/api/runtime", runtimeRoutes);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`BIS Runtime API running on port ${PORT}`);
});
