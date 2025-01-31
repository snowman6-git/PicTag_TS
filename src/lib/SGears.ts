import puppeteer from 'puppeteer';
import { blob } from 'stream/consumers';
import path = require("path")

export function print(text: any){
  console.log(text)
}

const COUNTER_BADGE = path.join(__dirname, '../../images/counter_badge.png')

async function html_to_img(htmlContent: string, selector: string){
  // Puppeteer 브라우저 인스턴스 생성
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // 샌드박스 비활성화
    headless: true, // 헤드리스 모드
  });
  const page = await browser.newPage();
  // HTML 콘텐츠를 페이지에 설정
  await page.setContent(htmlContent);
  const element = await page.$(selector);
    if (element){
      const screenshotBuffer = await element.screenshot({ 
        // encoding: 'binary', 투명도 유실됌
        path: path.join(__dirname, '../../images/counter_badge.png'),
        omitBackground: true 
      });
      // const blob_img = new Blob([screenshotBuffer], { type: 'image/png' });
      await browser.close();
      return true
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
    
    
    let html = await Bun.file('badge.html', "utf8").text(); //읽어주고
    let values = `
      <p>shields_io: ${shields_io}</p>
      <p>third: ${third}</p>
    `//동적추가 잡기
    let dynamic_adds = html.replace("dynamic_adds", values) //동적추가된걸로 수정

    await html_to_img(dynamic_adds, "#badge_counter") //수정된 html기반으로 html생성후 이미지 저장
    const blob_img = new Blob([await Bun.file(COUNTER_BADGE).arrayBuffer()], { type: 'image/png' }); //그걸 blob화
    return blob_img
  }}

