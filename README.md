<p align="center">
  <h1 align="center">🎨 Image Editor</h1>
  <p align="center">
    HYU-ERICA capstone project
  </p>
</p>

## Introduction
An image editor based on [Fabric.js](https://github.com/fabricjs/fabric.js).  
and Some parts of code are from [ToastUI Image Editor](https://github.com/nhn/tui.image-editor) and [glfx.js](https://github.com/evanw/glfx.js)

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/hbseo/image_editor/blob/master/LICENSE) 
[![version](https://img.shields.io/badge/react-16.13.1-blue)](https://reactjs.org/)
![node](https://img.shields.io/node/v/fabric)
## How to start
```
npm install
npm run start
```
Dependency conflicts may happen.

## Contributor
[Hyeon Beom Seo](https://github.com/hbseo)  
[Ju Kyung Yoon](https://github.com/JuKyYoon)[![time tracker](https://wakatime.com/badge/github/hbseo/image_editor.svg)](https://wakatime.com/badge/github/hbseo/image_editor)   
[Se Myeong Lee](https://github.com/3people)  

## Features

## Constructor

```
image_editor
│───README.md   
│
└───public
│   │───index.html
│   │
│   └───image
│       └───.svg
│
└───src
│   │───index.js
│   │───Route.js
│   │
│   └───css
│   │   │───Error.scss
│   │   │───ImageEditor.scss
│   │   │───ImageList.scss
│   │   │───Loading.scss
│   │   │───Main.scss
│   │   │───New_project.scss
│   │   │───Save.scss
│   │   │───UploadFIle.scss
│   │   │
│   │   └───Login
│   │   │   
│   │   └───ui
│   │
│   └───components
│       │───Change_password.js
│       │───Error.js
|       |───Find_password.js
│       │───ImageEditor.js
│       │───ImageList.js
│       │───LoadImage.js
│       │───Login.js
│       │───Main.js
│       │───New_project.js
│       │───Project.js
│       │───Save.js
│       │───SignIn.js
│       │───SignUp.js
│       │───Upload_file.js
│       │    
│       └─── action
│       │     │───Action.js
│       │     │───Clip.js
│       │     │───Crop.js
│       │     │───Delete.js
│       │     │───Draw.js
│       │     │───Fill.js
│       │     │───Filter.js
│       │     │───Flip.js
│       │     │───Icon.js
│       │     │───Image.js
│       │     │───Line.js
│       │     │───ObjectAction.js
│       │     │───Rotation.js
│       │     │───Shape.js
│       │     └───Text.js
│       │
│       └─── const
│       │     └───consts.js
│       │
│       └─── extension
│       │     │───Extension.js
│       │     │───Grid.js
│       │     │───Layers.js
│       │     └───Snap.js
│       │   
│       └─── filters
|       │    └─── glfx
│       │          │───denoise.js
│       │          │───ink.js
│       │          │───vibrance.js
│       │          │───vignette.js
│       │          └───zoomblur.js
│       │
│       └─── helper
│       │     │───Brush.js
│       │     │───originImage.js
│       │     │───Resize.js
│       │     └───SwithTools.js
│       │
│       └─── ui
│             │───Canvas.js
│             │───Draw.js
│             │───Filter.js
│             │───History.js
│             │───Icon.js
│             │───Image.js
│             │───Loading.js
│             │───Object.js
│             │───Rotation.js
│             │───Shape.js
│             │───SideNav.js
│             │───Text.js
│             └───Tools.js
│                                               
└───server
    │─── app.js
    │
    │─── config
    │     │───db-config.json
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
              │───auth
              │   │───controller.js 
              │   └───index.js
              │
              └───content
                  │───controller.js 
                  └───index.js

```

> npm run start

client port number 8080

---

>` /server `
>  node app

server port number 8000

---

### server/config/db-config.json
### server/config/user.sql
