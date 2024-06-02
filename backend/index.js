const app = require('./app'); // app.js dosyasını içe aktarın
const port = process.env.PORT || 4000;

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});
