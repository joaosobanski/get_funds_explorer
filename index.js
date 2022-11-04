const puppeteer = require('puppeteer');

const get = async () => {
    const url = 'https://www.fundsexplorer.com.br/ranking';

    const browser = await puppeteer.launch();

    try {
        const page = await browser.newPage();

        await page.goto(url);

        const session = await page.target().createCDPSession();
        await page.setBypassCSP(true);
        await session.send('Page.enable');
        await session.send('Page.setWebLifecycleState', {
            state: 'active',
        });

        // Bloquea la carga de recursos como imagenes y css
        await page.setRequestInterception(true);

        const rawData = await page.evaluate(() => {
            let data = [];
            let table = document.getElementById('table-ranking');

            for (var i = 1; i < table.rows.length; i++) {
                let objCells = table.rows.item(i).cells;

                let values = [];
                for (var j = 0; j < objCells.length; j++) {
                    let text = objCells.item(j).innerHTML;

                    if ((text + '').includes('<a href')) {

                        let trecho;
                        let pos1, pos2;
                        pos1 = text.indexOf('">');
                        pos2 = text.indexOf('</a>');

                        trecho = text.substring(pos1 + 2, pos2);
                        text = (trecho);
                    }

                    values.push(text);

                }
                let d = { i, values };
                data.push(d);
            }
            console.log(data)
            return data;
        });

    } catch (error) {
        console.log('error', error);
    }
}
get()

const main = async () => {
    console.log('foi')
    setInterval(async () => {
        await get()
        console.log('foi')
    }, [1000 * 10])
}

main()