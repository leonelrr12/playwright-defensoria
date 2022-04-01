const { chromium } = require('playwright');
const fs = require('fs');
const { setTimeout } = require('timers');

(async () => {
    // Make sure to run headed.
    const browser = await chromium.launch({ headless: false });

    const context = await browser.newContext({
        viewport: {
            width: 800,
            height: 600
        }
    })

    const page = await context.newPage();
    await page.goto('https://www.contraloria.gob.pa/CGR.PLANILLAGOB.UI/Formas/Index')
    
    const wtitle = page.locator('h2.itemTitle');
    const title = await wtitle.textContent();
    const entidad = title.trim() + '1.csv'

    const locator = page.locator('text=Next');
    const pages = page.locator('text=Page 1 of');

    let noPages = await pages.innerText();

    noPages = noPages.split(' ')[3];
    // console.log(noPages);
    noPages = 2;

    let wFile = '', head = true

    // while (noPages > 0) {
    //     const { data } = await writeData(page, head)

    //     // const espera = page.locator('table.tableJX6 tr')
    //     // await espera.waitFor()

    //     noPages -= 1
    //     wFile += data
    //     head = false

    //     await locator.click()
    //     // await page.waitForSelector('table')
    //     await page.waitForTimeout(1000);
    // } 

    // console.log(wFile)
   
    // fs.writeFile(entidad, wFile, (err) => {
    //     if (err)
    //         console.log(err);
    //     else {
    //         console.log("File written successfully\n");
    //         console.log("The written has the following contents:");
    //         // console.log(fs.readFileSync(entidad, "utf8"));
    //     }
    // });

    await context.close()
    await browser.close()
})();


const writeData = (page, head) => {
    return new Promise( async (resolve, reject) => {
        const rows = page.locator('table.tableJX6 tr');
        // Pattern 1: use locator methods to calculate text on the whole list.
        const texts = await rows.allTextContents();
    
        // Pattern 2: do something with each element in the list.
        let cols = [], n = 0, wcols = '', wPage = ''
        const count = await rows.count()
        for (let i = 0; i < count; ++i) {
            // console.log(await rows.nth(i).textContent());
            // wcols = await rows.nth(i).allTextContents()
            wcols = await rows.nth(i).innerHTML()
            cols = wcols.split('<td')
            // console.log(cols[0], cols[1], cols[2], cols[3], cols[4], cols[5], cols[6])

            let ix=0, fx=0, wLine=''
            n = cols.length
            for (let j = 0; j < n; j++) {
                if(i===0) {
                    if(head) {
                        ix = cols[j].indexOf('"field">')
                        ix = cols[j].indexOf('"field">', ix+1)
                        fx = cols[j].indexOf('</a>', ix+1)
                    }
                } else {
                    ix = cols[j].indexOf('"field">')
                    fx = cols[j].indexOf('</span>', ix+1)
                }
                if(ix > 0) {
                    // console.log(cols[j].slice(ix+8, fx));        
                    wLine += cols[j].slice(ix+8, fx) + '|'
                }
            }
            // console.log(wLine.slice(0, wLine.length-1))
            if(wLine.length > 20) {
                wPage += wLine.slice(0, wLine.length-1) + '\n'
            }

            // xy += 1
            // if(xy > 3) break;
        }

        resolve({ data: wPage });
    })
}

// npx playwright codegen wikipedia.org 
// npx playwright-cli --viewport-size 800,600 codegen wikipedia.org 
// npx playwright open --viewport-size=800,600 --color-scheme=dark twitter.com


// https://www.contraloria.gob.pa/CGR.PLANILLAGOB.UI/Formas/Index
// https://www.datosabiertos.gob.pa/dataset/css-planilla-de-recursos-humanos-enero-2022
// https://www.datosabiertos.gob.pa/dataset/css-planilla-institucional-febrero-2022

