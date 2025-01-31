import puppeteer from 'puppeteer';
import { blob } from 'stream/consumers';
const fs = require('fs');

export function print(text: any){
  console.log(text)
}



async function html_to_img(htmlContent: string, selector: string){
  // Puppeteer 브라우저 인스턴스 생성
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // HTML 콘텐츠를 페이지에 설정
  await page.setContent(htmlContent);
  const element = await page.$(selector);
    if (element){
      const screenshotBuffer = await element.screenshot({ 
        encoding: 'binary',
        path: "./aa.png",
        omitBackground: true 
      });
      
      const blob_img = new Blob([screenshotBuffer], { type: 'image/png' });
      await browser.close();
      return blob_img
    }
}



export class Badge {
  async counter(user: string){
    const url = `https://raw.githubusercontent.com/${user}/${user}/refs/heads/main/README.md`
    const git_readme = await fetch(url)
    .then((response) => response.text())
    .catch((error) => {
      console.error("Fetch error:", error);
    });

    let shields_io = git_readme.split("https://img.shields.io").length - 1 || 0
    let third = git_readme.split("http://pictag.aa2.uk").length - 1 || 0
    
    
    var html = fs.readFileSync('badge.html', "utf8");
    let values = `
      <p>shields_io: ${shields_io}</p>
      <p>third: ${third}</p>
    `
    let dynamic_adds = html.replace("dynamic_adds", values)

    let a = await html_to_img(dynamic_adds, "#badge_counter")
    const blob_img = new Blob([await Bun.file("aa.png").arrayBuffer()], { type: 'image/png' });
    return blob_img
  }}

