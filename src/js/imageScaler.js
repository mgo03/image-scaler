//画像の縮小率
const IMG_REDUCTION_RATIO = 0.2;

//画像のウィンドウ幅に対する比率
//この比率以下のサイズの画像は拡大しない
const MIN_IMG_WIDTH_RATIO = 1/3;

// zoomする画像が含まれる要素内の、imgタグを選択するセレクタ
// 参考:https://developer.mozilla.org/ja/docs/Web/API/Document/querySelectorAll
const IMG_SELECTORS = '.scale-img img';

const imgList = document.querySelectorAll(IMG_SELECTORS)

//ウィンドウ幅
const screenWidth = document.documentElement.clientWidth;
//拡大する画像の最小幅
const minImgWidth = screenWidth * MIN_IMG_WIDTH_RATIO;

//画像の縮小
const shrinkImage = (list) =>{
    for(let i = 0; i < list.length; i++){
        //元画像サイズ
        const naturalImgWidth = list[i].naturalWidth;
        const naturalImgHeight = list[i].naturalHeight;
        
        //縮小後の画像サイズ
        const modifiedImgWidth = naturalImgWidth * IMG_REDUCTION_RATIO;
        const modifiedImgHeight = naturalImgHeight * IMG_REDUCTION_RATIO;
        
        //画像の親要素の幅
        const parent = list[i].parentNode;
        const parentWidth = parent.offsetWidth;

        //縮小後の画像幅と親要素の幅を比較
        //縮小後の画像幅の方が大きい場合は画面幅に合わせ、小さい場合は縮小画像を適応
        if (modifiedImgWidth > parentWidth){
            console.log('画面幅に合わせて縮小')
            list[i].style.maxWidth = '100%'
        } else 
        {
            console.log('縮小')
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
    overLay.id = 'overlay'

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

    overLay.addEventListener('click',() => {
        overLay.classList.remove('show');
        img.classList.remove('scale');
        overLay.addEventListener('transitionend',() => {
            overLay.remove();
        })
    })
}

//条件に応じて画像を拡大
const expandImageByCondition = ()=>{
    for(let i = 0; i < imgList.length; i++){
        imgList[i].addEventListener('click',(e)=>{
            e.preventDefault();
            //元画像サイズ
            const naturalImgWidth = imgList[i].naturalWidth;
            //縮小後の画像サイズ
            const modifiedImgWidth = naturalImgWidth * IMG_REDUCTION_RATIO;

            if(modifiedImgWidth > minImgWidth){
                expandImage(imgList[i].src);
            }            
        })
    }
}

window.addEventListener('load',() => {
    if(imgList.length === 0) return;
        shrinkImage(imgList);
        expandImageByCondition();     
})