// import { test, expect, Page } from '@playwright/test';

// // Note that Promise.all prevents a race condition
// // between clicking and waiting for the download.
// (async()=>{
//     const [ download ] = await Promise.all([
//         // It is important to call waitForEvent before click to set up waiting.
//         page.waitForEvent('download'),
//         // Triggers the download.
//         page.locator('text=Download file').click(),
//       ]);
//       // wait for download to complete
//       const path = await download.path();
// })();


