<p align="center">
  <h1 align="center">🎨 Image Editor</h1>
</p>

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/hbseo/image_editor/blob/master/LICENSE) 
[![version](https://img.shields.io/badge/react-16.13.1-blue)](https://reactjs.org/)
![node](https://img.shields.io/node/v/fabric)

## Introduction  
Our project is an image editor that runs on a web browser written by Javascript.  
We used some references  
* An image editor based on [Fabric.js](https://github.com/fabricjs/fabric.js).  
* Some parts of code are from [ToastUI Image Editor](https://github.com/nhn/tui.image-editor) and [glfx.js](https://github.com/evanw/glfx.js)

## Overview  
* __Save and Load__ - Save current project as JPG or PNG. Also, Load from image.  
* __User ID__ - Manage projects using individual ID. Use mysql as Database. There are two tables USERS table and PROJECTS table.  
* __Main page__ - You can create or load a project of any size.  
<img src = "https://raw.githubusercontent.com/hbseo/image_editor/master/doc/pictures/main.png" width="50%">  

* __Editor page__ - Edit your project using tools.  
<img src = "https://raw.githubusercontent.com/hbseo/image_editor/master/doc/pictures/editor.png" width="50%">  

* __Get image__ - You can search under any title to use the image.  
<img src = "https://raw.githubusercontent.com/hbseo/image_editor/master/doc/pictures/get.png" width="50%">  

* __Load project__ - View projects when login.  
<img src = "https://raw.githubusercontent.com/hbseo/image_editor/master/doc/pictures/projects.png" width="50%">  

## How to start  
Before launching the below code open mysql and set [config](https://github.com/hbseo/image_editor/tree/master/server/config).   
You can start editor by executing following command.  
* client  
```
npm install
npm run start
```
* server  
```
npm ./server/app
```  
And then access it by using a browser. [http://localhost:8080](http://localhost:8080)  
Server is running on 8000 port.  
Dependency conflicts may happen.  

## Structure  
<details><summary>Details</summary>

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
│   │   │   │───font-awesome.min.scss
│   │   │   │───main.scss
│   │   │   │───util.scss
│   │   │   └───fonts
│   │   │   
│   │   └───ui
│   │       │───Draw.scss
│   │       │───Filter.scss
│   │       │───History.scss
│   │       │───Icon.scss
│   │       │───Image.scss
│   │       │───Rotation.scss
│   │       │───Shape.scss
│   │       └───Text.scss
│   │
│   └───locale
│   │   │───i18n.js
│   │   │
│   │   │───ko
│   │   │   └───korean.json
│   │   │
│   │   └───en
│   │       └───english.json
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
│       │     │───Pipette.js
│       │     │───Snap.js
│       │     └───Util.js
│       │   
│       └─── filters
|       │    └─── glfx
│       │          │───denoise.js
│       │          │───hexagonalPixelate.js
│       │          │───ink.js
│       │          │───vibrance.js
│       │          │───vignette.js
│       │          └───zoomblur.js
│       │
│       └─── helper
│       │     │───Brush.js
│       │     │───ConverRGB.js
│       │     │───originImage.js
│       │     │───Resize.js
│       │     └───SwithTools.js
│       │
│       └─── ui
│             │───Canvas.js
│             │───Draw.js
│             │───Effect.js
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

</details>


## Contributor  
[Hyeon Beom Seo](https://github.com/hbseo)  
[Ju Kyung Yoon](https://github.com/JuKyYoon)[![time tracker](https://wakatime.com/badge/github/hbseo/image_editor.svg)](https://wakatime.com/badge/github/hbseo/image_editor)   
[Se Myeong Lee](https://github.com/3people)  

## Bug Report  
If you find a bug. please report to us posting [issues](https://github.com/hbseo/image_editor/issues) on GitHub.
