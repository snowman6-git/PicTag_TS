## 정말 간단한 이미지 서버

### 25/2/1 10:46 -> 이제 안간단해짐.

기존의 Flask에서 포팅+연습겸 작성됌

|api이름|사용법|예시|설명|결과|
|------|-----|----|---|------|
|뱃지카운터|```/badges?tag={깃허브 유저명}&&from={내 뱃지 도메인1},{내뱃도2}```|/badges?tag=snowman6-git&&from=shields,pictag|readme의 도메인 갯수를 세어 출력합니다|![](http://pictag.aa2.uk/badges?tag=snowman6-git&&from=shields,pictag)|
|커스텀 뱃지|```/image?tag={image_name.format}```|image?tag=hono.svg|서버에 저장된 커스텀 뱃지를 사용합니다(개인용)|![](http://pictag.aa2.uk/image?tag=hono.svg)|

작은 팁: 새로고침이 안됐거나 했을떈 도메인에 약간의 변화만 줍시다 ex: from=shields -> from=shields.io

새로고침 됍니다.

기반: bun + hono



### 셋업

```
bun install
```
### 시작

```
bun run dev
```

open http://localhost:3001
