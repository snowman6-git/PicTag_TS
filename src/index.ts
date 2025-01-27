import { Hono } from 'hono'
import { file } from 'bun';
import path = require("path")

const app = new Hono()

app.get('/', (c) => {
  return c.text('welcome! this is personal image server!')
})

app.get('/image', async (c) => {
  const image = c.req.query('tag')?.toString() || "../"
  const jiral_no = !/[\.]{2,}|[\/\\]/.test(image) //.이 두개거나, /or\가 파라미터에 있다면 true /양옆에 안하면 씹힘
  if(jiral_no){
    const image_root = path.join(__dirname, '../images', image);
    return new Response(file(image_root));
  } else { return new Response(file(path.join(__dirname, '../images/don.webp'))) } //자신이 원하는 비정상 접근 대응
});

export default { 
  port: 3001, 
  fetch: app.fetch, 
} 