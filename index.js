const { ServiceControls } = require("./dist/addon");

(async () => {
    ServiceControls.PAUSE_CONTINUE;

    console.log(await ServiceController.getServices())
})();