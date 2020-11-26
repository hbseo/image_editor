<p align="center">
  <h1 align="center">🎨 Image Editor</h1>
  <p align="center">
    HYU-ERICA capstone project
  </p>
</p>

## Introduction
An image editor based on [Fabric.js](https://github.com/fabricjs/fabric.js).
and Some parts of code are from [ToastUI Image Editor](https://github.com/nhn/tui.image-editor)

[![license](https://img.shields.io/github/license/nhn/tui.image-editor.svg)](https://github.com/nhn/tui.image-editor/blob/master/LICENSE) 

## How to start
```
npm install
npm run start
```
Dependency conflicts may happen.

## Contributor
[Hyeon Beom Seo](https://github.com/hbseo)  
[Ju Kyung Yoon](https://github.com/JuKyYoon)  
[Se Myeong Lee](https://github.com/3people)  

## Features

## Constructor

```
image_editor
│───README.md   
│
└───src
│   │───index.js
│   │
│   └───components
│       │───ImageEditor.js
│       │───Error.js
│       |───Main.js
|       |───Action.js
│       │───Login.js
│       │    
│       └─── action
│            │───Crop.js
│            │───Delete.js
│            │───Fill.js
│            │───Filter.js
│            │───Flip.js
│            │───Icon.js
│            │───Rotation.js
│            │───Shape.js
│            └───Text.js
│   
└───server
│   └───index.js
|   
└───routes ─── api 
│              |───auth.controller.js
│              └───index.js
│              
└───middlewares ─── auth.js

```



## Notice
### /config/database.config 확인해서 데이터베이스 설정된거 자기 실행환경에 맞게 바꾸기 

` / `
> npm run start

client port number 8080

---

` /server `
> node index

server port number 8000

### check config/database.config !!!!!
install mysql and create a database before using the app
