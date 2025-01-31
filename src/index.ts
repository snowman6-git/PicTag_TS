import { Hono } from 'hono'
import { file } from 'bun';
import path = require("path")
import { Badge, print } from './lib/SGears' //자주 쓰거나 간단하지만 줄차지하는 모듈/함수
import { arrayBuffer, blob } from 'stream/consumers';



const app = new Hono()
const badge = new Badge()

function root_maker(image: string){
  return path.join(__dirname, '../images', image);
}


app.get('/', (c) => {
  return c.text('welcome! this is personal image server!')
})

app.get('/image', async (c) => {
  const image = c.req.query('tag')?.toString() || "../"
  const jiral_no = !/[\.]{2,}|[\/\\]/.test(image) //.이 두개거나, /or\가 파라미터에 있다면 true /양옆에 안하면 씹힘
  if(jiral_no){
    return new Response(file(root_maker(image)));
  } else { return new Response(file(path.join(__dirname, '../images/don.webp'))) } //자신이 원하는 비정상 접근 대응
});


app.get('/badges', async(c) => {
  const user = c.req.query('tag')?.toString() || "../"
  const a = await badge.counter(user)
  return c.text(a)
})
// https://github.com/snowman6-git/snowman6-git/blob/main/README.md?plain=1 로그인없어도 보임






export default { 
  port: 3001, 
  fetch: app.fetch, 
} 