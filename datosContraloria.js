const { chromium } = require('playwright');


(async () => {
    // Make sure to run headed.
    const browser = await chromium.launch({ headless: true });

    const context = await browser.newContext({
        viewport: {
            width: 800,
            height: 600
        }
    })

    const page = await context.newPage();
    await page.goto('https://www.contraloria.gob.pa/CGR.PLANILLAGOB.UI/Formas/Index')
    
    const wtitle = page.locator('#MainContent_lblFecha');
    const title = await wtitle.textContent();
    console.log(title);

    const entidades = ['TRIBUNAL DE CUENTAS','MINISTERIO DE AMBIENTE','MINISTERIO DE CULTURA']
    for (const entidad of entidades) {
        await down(page, entidad)
    }

    await context.close()
    await browser.close()
})();

const down = (page, entidad) => {

    return new Promise( async(resolve, reject) => {

        const reliablePath = `${entidad}.xlsx`
  
        await page.selectOption('#MainContent_ddlInstituciones', entidad);
        const btn = page.locator('#MainContent_btnBuscar');
        await btn.click()

        page.locator('#Div_BTN').waitFor();

        const [ download ] = await Promise.all([
            page.waitForEvent('download'), // wait for download to start
            page.click('#Div_BTN button')
        ]);
        // wait for download to complete
        // const path = await download.path();
        // save into the desired path
        await download.saveAs(reliablePath);
        // wait for the download and delete the temporary file
        await download.delete()

        resolve()
    })
}
