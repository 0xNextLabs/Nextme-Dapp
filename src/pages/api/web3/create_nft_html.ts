import type { NextApiRequest, NextApiResponse } from 'next'
import config from '@/config'

export default async function create_nft_html(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body.username) {
    res.status(301).json({
      message: 'missing parameter apikey',
    })
    return
  }
  // const {username,avatar,intro} = req.body
  let {
    username,
    nickname,
    avatar = '',
    intro = 'Nextme Social Pay',
    did,
    host = 'nextme.one',
    type = 'custom',
    imgStyle = '',
  } = req.body
  if (avatar == '') {
    avatar = 'https://bafybeib54ittxvhqpbj45q3zrostr2g7r3rkgihsjej26zno3khsydnrlm.ipfs.w3s.link/logo.png'
  }
  var animation_url = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.1.8/tailwind.css" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    
    <body>
        <div class="card-box">
            <div class="nft-card" style="transform-style:preserve-3d">
                <div class="content-front">
                    <img src="https://dlm9jyfbdnu7u.cloudfront.net/user/58b9c5c7-f9c4-4ee9-8159-b17e0505441f/1671118382491.png"
                        class="card-bg-img" alt="">
                    <div class="qrcode-bg">
                        <div id="qrcode" class="qrcode"></div>
                    </div>
                    <div class="host-box">
                        <p class="host-side">${config.host}&nbsp;/&nbsp;</p>
                        <p class="host-username">
                            &nbsp;&nbsp;${username}
                        </p>
                    </div>
                    <div class="name-box">
                        ${nickname}
                    </div>
                    <div class="intro-box line-clamp-4">
                        ${intro || 'Nextme Social Pay'}
                    </div>
                    <div class="avatar-box">
                        <div class="avatar-deepblue-box">
                            <img class="avatar-img"
                                src=${avatar} />
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" id="snap-svg" width="392" height="648">
                        <defs>
                            <linearGradient id="user-info-grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:rgba(1,116,227,0.4)" , stopOpacity: 1 } />
                                <stop offset="100%" style="stop-color:rgba(1,224,185,0.4)" , stopOpacity: 1 } />
                            </linearGradient>
                        </defs>
                        <path id="text-path-a"
                        d="M60 18 H 330 Q 380 18 380 69 V 580 Q 380 640 330 640 H 80 Q 20 640 20 580 V 58 Q 20 18 60 18 M60 18 H 330 Q 380 18 380 69 V 580 Q 380 640 330 640 H 80 Q 20 640 20 580 V 58 Q 20 18 60 18 M60 18 H 330 Q 380 18 380 69 V 580 Q 380 640 330 640 H 80 Q 20 640 20 580 V 58 Q 20 18 60 18 M60 18 H 330 Q 380 18 380 69 V 580 Q 380 640 330 640 H 80 Q 20 640 20 580 V 58 Q 20 18 60 18"
                            fill="#242437" fill-opacity="0" />
                        <g id="svg_4">
                            <!-- <rect stroke-width="6" fill="#242437" stroke="url(#user-info-grad1)" ry="40" rx="40" x="0" y="0"
                                width="392" height="648" id="user-info-svg_1"></rect> -->
                        </g>
                        <text text-rendering="optimizeSpeed">
                            <textPath startOffset="0%" fill="url(#user-info-grad1)" font-family="'Courier New', monospace"
                                font-size="12px" xlink:href="#text-path-a">
                                ${did}
                                <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="120s"
                                    repeatCount="indefinite" />
                            </textPath>
                            <textPath startOffset="12.5%" fill="url(#user-info-grad1)" font-family="'Courier New', monospace"
                                font-size="12px" xlink:href="#text-path-a">
                                ${did}
                                <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="120s"
                                    repeatCount="indefinite" />
                            </textPath>
                        </text>
                    </svg>
                </div>
                <div class="content-back">
                    <img src="https://dlm9jyfbdnu7u.cloudfront.net/user/58b9c5c7-f9c4-4ee9-8159-b17e0505441f/1671118382491.png"
                        class="card-bg-img" alt="">
                    <svg xmlns="http://www.w3.org/2000/svg" id="snap-svg2" width="392" height="648">
                        <g id="svg_4">
                            <text xml-space="preserve" text-anchor="start"
                                font-family="'Satisfy,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace'"
                                font-size="38" id="svg_15" y="300" x="147" class="font-satisfy" stroke="#fff" fill="#fff">
                                Nextme
                            </text>
                        </g>
                        <text text-rendering="optimizeSpeed">
                            <textPath startOffset="0%" fill="url(#user-info-grad1)" font-family="'Courier New', monospace"
                                font-size="12px" xlink:href="#text-path-a">
                                ${did}
                                <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="120s"
                                    repeatCount="indefinite" />
                            </textPath>
                            <textPath startOffset="12.5%" fill="url(#user-info-grad1)" font-family="'Courier New', monospace"
                                font-size="12px" xlink:href="#text-path-a">
                                ${did}
                                <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="120s"
                                    repeatCount="indefinite" />
                            </textPath>
                        </text>
                    </svg>
                </div>
            </div>
        </div>
    </body>
    
    </html>
    <style>
        @font-face {
            font-family: 'Satisfy';
            src: url(https://fonts.gstatic.com/s/satisfy/v17/rP2Hp2yn6lkG50LoCZOIHTWEBlw.woff2);
        }
    
        .card-box {
            height: 500px;
        }
    
        .content-box {
            transform-style: preserve-3d;
        }
    
        .animate-rotateY {
            animation: rotateY360 10s 0s linear infinite;
        }
    
        @keyframes rotateY360 {
            0% {
                transform: rotateY(0deg);
            }
    
            80% {
                transform: rotateY(360deg);
            }
    
            100% {
                transform: rotateY(360deg);
            }
        }
    
        .content-front {
            height: 100%;
            width: 100%;
            position: absolute;
            top: 5;
            backface-visibility: hidden;
        }
    
        .avatar-img {
            ${imgStyle}
            ${
              !imgStyle
                ? `
            max-wdith:100%;
            border-radius:50%
            `
                : `
            max-width: none;
            `
            }
        }
    
    
        .content-back {
            backface-visibility: hidden;
            transform: rotateY(180deg);
            height: 100%;
            width: 100%;
            position: absolute;
            right: 5px;
            top: 5;
            backface-visibility: hidden;
        }
    
        .nft-card {
            margin: auto;
            animation: rotateY360 10s 0s linear infinite;
            width: 402px;
            height: 658px;
            scale: 0.65;
            padding: 5px;
            /* background-image: linear-gradient(to right, #3b82f6, #4ade80); */
            position: relative;
            border-radius: 40px;
            margin-top: -100px;
        }
    
        .content-back {
            backface-visibility: hidden;
            transform: rotateY(180deg);
        }
    
        .stop-0 {
            stop-color: rgba(1, 116, 227, 0.4);
            stop-opacity: 1;
        }
    
        .line-clamp-4 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
        }
    
        .stop-1 {
            stop-color: rgba(1, 224, 185, 0.4);
            stop-opacity: 1;
        }
    
        .font-satisfy {
            font-family: 'Satisfy';
            font-size: 38px;
        }
    
        .qrcode-bg {
            padding: 0.25rem;
            position: absolute;
            top: 400px;
            left: 60px;
        }
    
        .intro-box {
            opacity: 0.2;
            color: #fff;
            text-align: left;
            width: 75%;
            position: absolute;
            left: 60px;
            top: 240px;
            overflow-wrap: break-word
        }
    
        .host-box {
            display: flex;
            position: absolute;
            top: 550px;
            left: 60px;
            justify-content: start;
        }
    
        .host-side {
            line-height: 1.5rem;
            color: white;
        }
    
        .host-username {
            background: #18182c;
            color: white;
            width: 8rem;
            text-align: left;
            line-height: 1.5rem;
            border-radius: 0.25rem;
        }
    
        .name-box {
            position: absolute;
            width: 75%;
            top: 190px;
            left: 60px;
            text-align: left;
            -webkit-background-clip: text;
            background-clip: text;
            overflow: hidden;
            white-space: nowrap;
            color:transparent;
            text-overflow: ellipsis;
            font-size: 1.875rem;
            line-height: 2.25rem;
            background-image: linear-gradient(82.49deg, #5D636D 0.69%, #EEEEEE 40.79%);
        }
    
        .avatar-box {
            position: absolute;
            left: 60px;
            border-radius: 50%;
            top: 70px;
            width: 105px;
            height: 105px;
            overflow: hidden;
            padding: 3px;
            background-image: linear-gradient(to right, #3b82f6, #4ade80);
        }
    
        .avatar-deepblue-box {
            background: #242438;
            padding: 3px;
            width: 100%;
            height: 100%;
            border-radius: inherit;
            overflow: hidden
        }
    
        .card-bg-img {
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgb(36 36 56);
            z-index: -10;
            border-radius: 2rem;
        }
    </style>
    <script src="http://cdn.bootcss.com/snap.svg/0.4.1/snap.svg-min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script>
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            text: "https://${host}/${username}",
            width: 108,
            height: 108,
            colorDark: "#085679",
            colorLight: "rgba(0,0,0,0)",
            correctLevel: QRCode.CorrectLevel.H
        });
    </script>`
  var image = `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="user-info-svg" width="392" height="648">
    <defs>
        <linearGradient id="user-info-grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color: rgba(1, 116, 227, 0.4); stop-opacity: 1;"></stop>
            <stop offset="100%" style="stop-color: rgba(1, 224, 185, 0.4); stop-opacity: 1;"></stop>
        </linearGradient>
    </defs>
    <defs>
        <path d="M60 18 H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18" fill="transparent" id="user-info-path-def"></path>
    </defs>
    <title>${nickname}</title>
    <path id="text-path-a" d="M60 18 H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18" />
    <g id="user-info-svg_4">
        <rect stroke-width="6" fill="#242437" stroke="url(#user-info-grad1)" ry="40" rx="40" x="0" y="0" width="392" height="648" id="user-info-svg_1"></rect>
        <path d="M60 18 H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18" fill="transparent" id="user-info-transpath"></path>
        <defs>
            <pattern id="user-info-raduisImage" patternUnits="userSpaceOnUse" width="500" height="500">
         <image xlink:href="${avatar}" x="57" y="65" width="118" height="118"></image> 
            </pattern>
        </defs>
        <g rx="59" ry="59">
            <circle cx="113" cy="118" r="50" fill="url(#user-info-raduisImage)"></circle>
        </g>
        <text stroke="#fff" xml:space="preserve" text-anchor="start" font-family="'DM Sans'" font-size="42" id="user-info-svg_11" y="225" x="57" fill="#fff">${nickname}</text>
        <path id="user-info-svg_12" d="m64,237" opacity="NaN" stroke-width="3.5" stroke="#000" fill="#ffffff"></path>
        <text xml:space="preserve" text-anchor="start" font-family="'DM Sans'" font-size="20" id="user-info-svg_13" y="265" x="57" stroke="#fff" opacity="0.2" fill="#fff">${intro}</text>
        <svg height="107" width="107" viewBox="0 0 25 25" y="427" x="57" id="user-info-bill_qr_code_url">
            <path fill="#FFFFFF" d="M0,0 h25v25H0z" shape-rendering="crispEdges"></path>
            <path fill="#000" d="M0 0h7v1H0zM8 0h2v1H8zM12 0h1v1H12zM14 0h1v1H14zM18,0 h7v1H18zM0 1h1v1H0zM6 1h1v1H6zM8 1h4v1H8zM16 1h1v1H16zM18 1h1v1H18zM24,1 h1v1H24zM0 2h1v1H0zM2 2h3v1H2zM6 2h1v1H6zM8 2h2v1H8zM13 2h1v1H13zM15 2h2v1H15zM18 2h1v1H18zM20 2h3v1H20zM24,2 h1v1H24zM0 3h1v1H0zM2 3h3v1H2zM6 3h1v1H6zM9 3h5v1H9zM15 3h2v1H15zM18 3h1v1H18zM20 3h3v1H20zM24,3 h1v1H24zM0 4h1v1H0zM2 4h3v1H2zM6 4h1v1H6zM8 4h1v1H8zM10 4h1v1H10zM16 4h1v1H16zM18 4h1v1H18zM20 4h3v1H20zM24,4 h1v1H24zM0 5h1v1H0zM6 5h1v1H6zM12 5h1v1H12zM14 5h1v1H14zM18 5h1v1H18zM24,5 h1v1H24zM0 6h7v1H0zM8 6h1v1H8zM10 6h1v1H10zM12 6h1v1H12zM14 6h1v1H14zM16 6h1v1H16zM18,6 h7v1H18zM9 7h1v1H9zM12 7h3v1H12zM16 7h1v1H16zM0 8h1v1H0zM3 8h7v1H3zM12 8h3v1H12zM16 8h2v1H16zM20 8h1v1H20zM22,8 h3v1H22zM0 9h4v1H0zM15 9h1v1H15zM17 9h1v1H17zM20 9h4v1H20zM0 10h1v1H0zM4 10h1v1H4zM6 10h7v1H6zM15 10h3v1H15zM19 10h2v1H19zM22,10 h3v1H22zM1 11h1v1H1zM3 11h1v1H3zM5 11h1v1H5zM7 11h2v1H7zM10 11h2v1H10zM15 11h1v1H15zM17 11h1v1H17zM22 11h2v1H22zM3 12h1v1H3zM6 12h1v1H6zM10 12h3v1H10zM16 12h3v1H16zM21 12h1v1H21zM23,12 h2v1H23zM0 13h4v1H0zM5 13h1v1H5zM9 13h1v1H9zM13 13h3v1H13zM17 13h1v1H17zM19 13h5v1H19zM0 14h2v1H0zM3 14h1v1H3zM6 14h1v1H6zM8 14h1v1H8zM11 14h6v1H11zM18 14h4v1H18zM24,14 h1v1H24zM0 15h1v1H0zM2 15h2v1H2zM5 15h1v1H5zM9 15h1v1H9zM11 15h1v1H11zM16 15h2v1H16zM19 15h1v1H19zM22,15 h3v1H22zM0 16h1v1H0zM2 16h1v1H2zM5 16h2v1H5zM8 16h1v1H8zM12 16h2v1H12zM15 16h6v1H15zM22,16 h3v1H22zM8 17h5v1H8zM14 17h3v1H14zM20 17h1v1H20zM22 17h1v1H22zM0 18h7v1H0zM8 18h2v1H8zM11 18h2v1H11zM14 18h1v1H14zM16 18h1v1H16zM18 18h1v1H18zM20,18 h5v1H20zM0 19h1v1H0zM6 19h1v1H6zM8 19h1v1H8zM10 19h1v1H10zM13 19h1v1H13zM16 19h1v1H16zM20 19h1v1H20zM23,19 h2v1H23zM0 20h1v1H0zM2 20h3v1H2zM6 20h1v1H6zM8 20h1v1H8zM10 20h1v1H10zM14 20h8v1H14zM0 21h1v1H0zM2 21h3v1H2zM6 21h1v1H6zM8 21h2v1H8zM11 21h2v1H11zM16 21h1v1H16zM18 21h1v1H18zM21 21h1v1H21zM23,21 h2v1H23zM0 22h1v1H0zM2 22h3v1H2zM6 22h1v1H6zM9 22h1v1H9zM11 22h1v1H11zM15 22h1v1H15zM20,22 h5v1H20zM0 23h1v1H0zM6 23h1v1H6zM9 23h1v1H9zM11 23h2v1H11zM15 23h1v1H15zM17 23h2v1H17zM22,23 h3v1H22zM0 24h7v1H0zM8 24h1v1H8zM10 24h2v1H10zM14 24h7v1H14zM24,24 h1v1H24z" shape-rendering="crispEdges"></path>
        </svg>
        <text xml:space="preserve" text-anchor="start" font-family="'DM Sans'" font-size="16" id="user-info-svg_15" y="564" x="57" stroke="#fff" fill="#fff">${config.host}/</text>
        <rect id="user-info-svg_16" height="21" width="126" y="550" x="162" rx="6" ry="6" fill="rgba(24,24,38.95)"></rect>
        <text xml:space="preserve" text-anchor="start" font-family="'DM Sans'" font-size="16" id="user-info-svg_17" y="564" x="170" stroke="#fff" fill="#fff">${username}</text>
    </g>
    <desc>Created with Snap</desc>
    <path d="M60 18 H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18" fill="none" strokeWitdh="1" style="stroke-dasharray: 5, 5;" id="pathSl8ifct0e1m"></path>
    <path d="M330 630 H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630 H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630" fill="none" strokeWitdh="1" style="stroke-dasharray: 5, 5;" id="pathSl8ifct0e1o"></path>
    <text x="0" y="0" fill="url(#user-info-grad1)" style="font-size: 10.5px;">
    </text>
    <text x="0" y="0" fill="url(#user-info-grad1)" style="font-size: 10.5px;">
    </text>
    <path d="M60 18 H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18" fill="none" strokeWitdh="1" style="stroke-dasharray: 5, 5;" id="pathSl8ifct0e20"></path>
    <path d="M330 630 H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630 H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630" fill="none" strokeWitdh="1" style="stroke-dasharray: 5, 5;" id="pathSl8ifct0e21"></path>
    <text x="0" y="0" fill="url(#user-info-grad1)" style="font-size: 10.5px;">
    </text>
    <text x="0" y="0" fill="url(#user-info-grad1)" style="font-size: 10.5px;">
    </text>
    <path d="M60 18 H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18H 330 Q 370 18 370 69 V 580 Q 370 630 330 630 H 80 Q 20 630 20 580 V 58 Q 20 18 60 18" fill="none" strokeWitdh="1" style="stroke-dasharray: 5, 5;" id="pathSl8ifct0e2o"></path>
    <path d="M330 630 H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630 H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630H 60 Q 20 630 20 580 V 60 Q 20 18 60 18 H 330 Q 370 18 370 69V 580 Q 370 630 330 630" fill="none" strokeWitdh="1" style="stroke-dasharray: 5, 5;" id="pathSl8ifct0e2p"></path>
    <text x="0" y="0" fill="url(#user-info-grad1)" style="font-size: 10.5px;">
    </text>
    <text x="0" y="0" fill="url(#user-info-grad1)" style="font-size: 10.5px;">
    </text>
    <text text-rendering="optimizeSpeed">
        <textPath startOffset="-100%"  fill="url(#user-info-grad1)" font-family="'Courier New', monospace" font-size="12px" xlink:href="#text-path-a">
${did}
            <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite" />
        </textPath>
        <textPath startOffset="0%"  fill="url(#user-info-grad1)" font-family="'Courier New', monospace" font-size="12px" xlink:href="#text-path-a">
${did}
            <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite" />
        </textPath>
        <textPath startOffset="50%"  fill="url(#user-info-grad1)" font-family="'Courier New', monospace" font-size="12px" xlink:href="#text-path-a">
${did}
            <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite" />
        </textPath>
        <textPath startOffset="-50%"  fill="url(#user-info-grad1)" font-family="'Courier New', monospace" font-size="12px" xlink:href="#text-path-a">
  ${did}
            <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite" />
        </textPath>
    </text>
</svg>
  `
  res.status(200).json({
    message: {
      image,
      animation_url,
    },
  })
}
