import { defineSupportCode, HookScenarioResult } from 'cucumber';
import * as path from 'path';
import { browser } from 'protractor';
import { WriteStream, ensureDirSync, createWriteStream } from 'fs-extra';

interface World {
    'attach': ((arg1: string | Buffer, arg2: string) => void);
}


defineSupportCode(({ Before, After }) => {

    Before(async function (scenario) {
        browser.ignoreSynchronization = true;
        return await browser.manage().window().maximize();
    })

    // After(async (scenario) => {
    //     return await browser.restart();
    // });

    After(function (scenarioResult: HookScenarioResult): Promise<void> {
        const world = this;
        return (scenarioResult.status === 'failed') ? saveFailedScenarioScreenshot(<World>world, scenarioResult) : Promise.resolve();
    });

    async function saveFailedScenarioScreenshot(world: World, scenarioResult: HookScenarioResult) {
        const screenshot = await (browser.takeScreenshot());
        const fileName = `${scenarioResult.scenario.name
            .replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, '-')
            .toLowerCase().substr(0, 100)}.png`;
        world.attach(screenshot, 'image/png');
        saveScreenshot(screenshot, fileName);
        return Promise.resolve();
    }

    function saveScreenshot(screenshot: string, fileName: string) {
        const screenshotPath = path.resolve(process.cwd(), '.tmp/screenshots');
        const filepath = path.resolve(screenshotPath, fileName);
        let stream: WriteStream;
        ensureDirSync(screenshotPath);
        stream = createWriteStream(filepath);
        stream.write(new Buffer(screenshot, 'base64'));
        stream.end();
    }
});