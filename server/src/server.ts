import { config } from "./config/config";
import { app } from ".";
import { connectDB } from "./db/config";

const PORT = config.get("PORT");

(async function(){
    await connectDB()
    app.listen(PORT || 3000, () => {
        console.log("server is running at PORT || " + PORT);
    })
})();