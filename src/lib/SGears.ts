import puppeteer from 'puppeteer';
import { blob } from 'stream/consumers';
import path = require("path")

export function print(text: any){
  console.log(text)
}

const COUNTER_BADGE_HTML = path.join(__dirname, '../../badge.html')

async function html_to_img(htmlContent: string, selector: string, user: string){
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
        path: path.join(__dirname, `../../images/${user}_counter_badge.png`),
        omitBackground: true 
      });
      // const blob_img = new Blob([screenshotBuffer], { type: 'image/png' });
      await browser.close();
      return true
    }
}



export class Badge {
  async counter(user: string, badge_list: string[]){
    const url = `https://raw.githubusercontent.com/${user}/${user}/refs/heads/main/README.md`
    const git_readme = await fetch(url)
    .then((response) => response.text())
    .catch((error) => {
      console.error("Fetch error:", error);
    });
    //으악! 이건 꼭 시간나면 고쳐라!!!
    let values = `
      <legend style="font-size: 0.85rem">Terminal</legend>
      <div style="font-size: 1.25rem; margin-bottom: 0.5rem">pictag@git:~# ls -la ${user}</div>
    `
    let temp = "";
    let count_result = 0;
    badge_list.forEach(badge_from => {
      let count_badge_from = git_readme.split(badge_from).length - 1 || 0
      count_result += count_badge_from //누적합산 뭐시기 쓰기
      temp += `<div class="log" style="font-size: 0.85rem">drwxr-xr-x ${count_badge_from} root ${badge_from} 8192 Feb 1 03:16 badge.svg </div>`
    });
    values += `<div class="log">total ${count_result}</div>`
    values += temp

    // let third = git_readme.split("http://pictag.aa2.uk").length - 1 || 0
    
    let html = await Bun.file(COUNTER_BADGE_HTML, "utf8").text(); //읽어주고

    let dynamic_adds = html.replace("dynamic_adds", values) //동적추가된걸로 수정

    await html_to_img(dynamic_adds, "#badge_counter", user) //수정된 html기반으로 html생성후 이미지 저장
    const blob_img = new Blob([await Bun.file(path.join(__dirname, `../../images/${user}_counter_badge.png`)).arrayBuffer()], { type: 'image/png',  })
    return blob_img
  }
}

