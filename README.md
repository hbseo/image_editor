<p align="center">
  <h1 align="center">🎨 Image Editor</h1>
  <p align="center">
    HYU-ERICA capstone project
  </p>
</p>

## Introduction
An image editor based on [Fabric.js](https://github.com/fabricjs/fabric.js).  
and Some parts of code are from [ToastUI Image Editor](https://github.com/nhn/tui.image-editor) and [glfx.js](https://github.com/evanw/glfx.js)

[![license](https://img.shields.io/github/license/nhn/tui.image-editor.svg)](https://github.com/hbseo/image_editor/blob/master/LICENSE) 

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
│       │───ImageList.js
│       │───Error.js
│       |───Main.js
│       │───Login.js
│       │    
│       └─── action
│       │     │───Action.js
│       │     │───Crop.js
│       │     │───Delete.js
│       │     │───Draw.js
│       │     │───Fill.js
│       │     │───Filter.js
│       │     │───Flip.js
│       │     │───Icon.js
│       │     │───Image.js
│       │     │───Line.js
│       │     │───Rotation.js
│       │     │───Shape.js
│       │     └───Text.js
│       │
│       └─── extension
│       │     │───Extension.js
│       │     │───Grid.js
│       │     │───Layers.js
│       │     └───Snap.js
│       │   
│       └─── filters
|       │    └─── glfx
│       │          └───ink.js
│       │
│       └─── helper
│             └───Resize.js                            
│   
└───server
    │─── app.js
    │
    │─── config
    │     │───db-config.json
    │     │───key.js
    │     │───jwt.js
    │     └───user.sql
    │
    │─── database
    │     └───index.js
    │
    │─── middlewares
    │     └───auth.js
    │
    └─── routes
          └───api
              └───auth
                  │───controller.js 
                  └───index.js




   


```

` / `
> npm run start

client port number 8080

---

` /server `
> node app

server port number 8000

### server/config/db-config.json
### server/config/user.sql
