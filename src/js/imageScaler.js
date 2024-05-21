        try {
            // 名前空間が重複している場合は実行しない
            var ImageScaler = ImageScaler || {};
            ((global) => {
                const _ = ImageScaler;

                // プライベートメソッド
                // 拡大・縮小したい画像を含むclass名のimgタグを指定
                // 参考:https://developer.mozilla.org/ja/docs/Web/API/Document/querySelectorAll
                let scaler_imgs = [];
                let scaler_listeners = [];
                //ウィンドウ幅
                const screenWidth = document.documentElement.clientWidth;
                const overLayWindowId = 'scale-image-overlay-window';
                //拡大する画像の最小幅
                // パブリックメソッド
                _.IMG_REDUCTION_RATIO = 0.2;
                //画像のウィンドウ幅に対する比率
                //この比率以下のサイズの画像は拡大しない
                _.MIN_IMG_WIDTH_RATIO = 0;
                _.TARGET_CLASS = '.scale-img';
                
                const IMG_SELECTORS = `${_.TARGET_CLASS} img`;
                const minImgWidth = (() => screenWidth * _.MIN_IMG_WIDTH_RATIO)();

                //プライベートメソッド
                //画像の縮小
                const shrinkImage = (list) => {
                    for (let i = 0; i < list.length; i++) {
                        //元画像サイズ
                        const naturalImgWidth = list[i].naturalWidth;
                        const naturalImgHeight = list[i].naturalHeight;

                        //縮小後の画像サイズ
                        const modifiedImgWidth = naturalImgWidth * _.IMG_REDUCTION_RATIO;
                        const modifiedImgHeight = naturalImgHeight * _.IMG_REDUCTION_RATIO;

                        //画像の親要素の幅
                        const parent = list[i].parentNode;
                        const parentWidth = parent.offsetWidth;

                        //縮小後の画像幅と親要素の幅を比較
                        //縮小後の画像幅の方が大きい場合は画面幅に合わせ、小さい場合は縮小画像を適応
                        if (modifiedImgWidth > parentWidth) {
                            list[i].style.maxWidth = '100%'
                        } else {
                            list[i].style.height = `${modifiedImgHeight}px`
                            list[i].style.width = `${modifiedImgWidth}px`
                        }

                        //縮小時のちらつき対策
                        list[i].style.visibility = 'visible'
                    }
                }

                //タップ時に画像拡大
                const expandImage = (imgSrc) => {
                    //overlay > imgContainer > img
                    const overLay = document.createElement('div');
                    overLay.id = overLayWindowId;

                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('img-container');
                    overLay.appendChild(imgContainer);

                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.style.visibility = 'visible'
                    imgContainer.appendChild(img);

                    document.body.prepend(overLay);

                    overLay.classList.add('show');
                    img.classList.add('scale');


                    overLay.addEventListener('click', () => {
                        overLay.classList.remove('show');
                        img.classList.remove('scale');
                        overLay.addEventListener('transitionend', () => {
                            overLay.remove();
                        })
                    })
                }

                const scaleImageClicker = (e) => {
                    e.preventDefault();
                    //元画像サイズ
                    const naturalImgWidth = e.target.naturalWidth;
                    //縮小後の画像サイズ
                    const modifiedImgWidth = naturalImgWidth * _.IMG_REDUCTION_RATIO;
                    if (modifiedImgWidth > minImgWidth) {
                        expandImage(e.target.src);
                    }
                };
                //条件に応じて画像を拡大
                const expandImageByCondition = () => {
                    for (let i = 0; i < scaler_imgs.length; i++) {
                        scaler_imgs[i].addEventListener('click', scaleImageClicker);
                        scaler_listeners.push(scaler_imgs[i]);
                    }
                }

                const loadImageScaler = () => {
                    // 登録されているイベントリスナーを全て削除
                    if (scaler_listeners.length > 0) {
                        for (let i = 0; i < scaler_listeners.length; i++) {
                            scaler_listeners[i].removeEventListener('click', scaleImageClicker);
                        }
                        scaler_listeners = [];
                    }
                    if (scaler_imgs.length === 0) return;
                    shrinkImage(scaler_imgs);
                    // リスナー再登録
                    expandImageByCondition();
                };
                const scaler_observer = new MutationObserver((record) => {
                    // オーバーレイウィンドウが追加された場合は処理しない
                    if(record[0].addedNodes.length > 0 && record[0].addedNodes[0].id === overLayWindowId) return;
                    scaler_imgs = document.querySelectorAll(IMG_SELECTORS);
                    loadImageScaler();
                });
                // コンストラクタ
                window.addEventListener('load',()=>{
                    scaler_observer.observe(document, { childList: true, subtree: true });
                    scaler_imgs = document.querySelectorAll(IMG_SELECTORS);
                    loadImageScaler();
                });
            })(this);
        } catch (e) {
            console.warn('ImageScaler Error',e);
        }