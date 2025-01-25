import { Hono } from 'hono'
import { join } from 'path';
import { serveStatic } from 'hono/bun'
import { file } from 'bun';

const app = new Hono()
app.use('./images/*', serveStatic({ root: './' }))

app.get('/', (c) => {
  return c.text('welcome! this is personal image server!')
})

app.get('/image', async (c) => {
  const image = c.req.query('tag')?.toString() || "../"
  const jiral_no = !/[\.]{2,}|[\/\\]/.test(image) //.이 두개거나, /or\가 파라미터에 있다면 true /양옆에 안하면 씹힘
  if(jiral_no){
    const image_root = join(process.cwd(), `./images/${image}`); // 파일 경로 설정
    return new Response(file(image_root)); 
  } else { return new Response(file(join(process.cwd(), `./images/don.webp`))) } //자신이 원하는 비정상 접근 대응
});

export default { 
  port: 3001, 
  fetch: app.fetch, 
} 