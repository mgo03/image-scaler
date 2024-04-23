# image-scaler
- 大きいサイズの画像を、任意のサイズに縮小する。  
縮小しても画像幅がウィンドウからはみ出てしまう場合は、画像幅＝ウィンドウ幅にする。  
- タップしたら画像を拡大する  
ウィンドウ幅の一定比率（デフォルト値は1/3）より小さい画像は、拡大しない仕様とした。  

## 使い方

### HTML
1. imageScaler.js、imageScaler.cssを読み込む。
```
<head>
    ...
    <link rel="stylesheet" href="imageScaler.css">
</head>
<body>
    ...
    <script src="imageScaler.js"></script>
</body>
```
2. 拡大・縮小したい画像をdiv等で囲み、任意のクラス名をつける（デフォルト：scale-img）。
```
    <div class="scale-img">
        <img src="img/hoge.png"/>
    </div>
```
### CSS
デフォルト以外のクラス名をつけた場合、
```
    .scale-img img {
    visibility: hidden;
    }
```
の'scale-img'の部分を変更する。


### JavaScript

| 名前 | 型 | デフォルト | 説明 |
| -- | -- | -- | -- |
|IMG_REDUCTION_RATIO | number (0~1) | 0.2 | 画像の縮小率 |
|MIN_IMG_WIDTH_RATIO | number (0~1) | 1/3 | 画像のウィンドウ幅に対する比率 　<br>この比率以下のサイズの画像は拡大しない|
|IMG_SELECTORS | string | '.scale-img img' | 拡大・縮小したい画像を囲んだclass名のimgタグを指定<br> [querySelectorAll](https://developer.mozilla.org/ja/docs/Web/API/Document/querySelectorAll)|

## ライセンス

[MIT](https://github.com/mgo03/image-scaler/blob/main/LICENSE)