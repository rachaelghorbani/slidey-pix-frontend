document.addEventListener('DOMContentLoaded', e => {
  console.log('loaded!')
  // const canvas = document.querySelector('canvas');
  // const ctx = canvas.getContext('2d');
  // const makeSquare = () => {
  //   const canvas = document.createElement('canvas');
  //   const ctx = canvas.getContext('2d');


  //   let imgObj = new Image();
  //   imgObj.crossOrigin = "anonymous";
  //   imgObj.src = 'https://live.staticflickr.com/4443/37614774531_72a256658b_3k.jpg';



  //   imgObj.onload = function () {
  //     let w = 1200;
  //     let nw = imgObj.naturalWidth;
  //     let nh = imgObj.naturalHeight;

  //     // we actually DON'T want to force the canvas to be a square anymore
  //     // we want it to be a rectangle so we can crop out the sides manually
  //     let aspect = nw / nh;
  //     let h = w / aspect;
  //     canvas.height = h;




  //     const ratio = w / nw
  //     const difference = nw - nh;
  //     const toCrop = (ratio * difference) / 2;

  //     // otherwise the canvas is larger than the image
  //     canvas.width = w - (toCrop * 2);

  //     ctx.drawImage(imgObj, -toCrop, 0, w - toCrop, h);
  //     cropImage(canvas.toDataURL());
  //   }


  // }

  const cropImage = () => {

    const origCanvas = document.createElement('canvas');
    const origCtx = origCanvas.getContext('2d');

    let sqrImgObj = new Image();
    sqrImgObj.crossOrigin = "anonymous";
    sqrImgObj.src = 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format';

    sqrImgObj.onload = function () {
      let w = 1200;
      let nw = sqrImgObj.naturalWidth;
      let nh = sqrImgObj.naturalHeight;

      // we actually DON'T want to force the canvas to be a square anymore
      // we want it to be a rectangle so we can crop out the sides manually
      let aspect = nw / nh;
      let h = w / aspect;
      origCanvas.height = h;




      const ratio = w / nw
      const difference = nw - nh;
      const origToCrop = (ratio * difference) / 2;

      // otherwise the canvas is larger than the image
      origCanvas.width = w - (origToCrop * 2);

      origCtx.drawImage(sqrImgObj, -origToCrop, 0, w - origToCrop, h);




      let imgObj = new Image();
      imgObj.crossOrigin = "anonymous";
      imgObj.src = origCanvas.toDataURL();
      imgObj.onload = function() {
      let imagePieces = [];
      let i = 0;
      for (let x = 0; x < 3; ++x) {
        for (let y = 0; y < 3; ++y) {

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          let w = canvas.width;
          let nw = imgObj.naturalWidth;
          let nh = imgObj.naturalHeight;

          // we actually DON'T want to force the canvas to be a square anymore
          // we want it to be a rectangle so we can crop out the sides manually
          let aspect = nw / nh
          let h = w / aspect;
          canvas.height = h;
          const ratio = w / nw;
          const difference = nw - nh;

          const toCrop = (ratio * difference) / 2;
          canvas.width = w - (toCrop * 2)
          let heightOfOnePiece = nh / 3;
          let widthOfOnePiece = heightOfOnePiece;




          if (x === 0) {
            ctx.drawImage(imgObj, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, h, h);
          } else if (x === 1) {
            ctx.drawImage(imgObj, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, h, h);
          } else if (x === 2) {
            ctx.drawImage(imgObj, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, h, h);
          }

          // if (x != 0) {
          //   ctx.drawImage(imgObj, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, w / 3, h / 3);
          // } else {
          //   ctx.drawImage(imgObj, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, -toCrop, 0, w / 3, h / 3);
          // }
          imagePieces.push(canvas.toDataURL());
          const tile = document.querySelector(`#tile-${i}`);
          tile.innerHTML = `${i}<img src='${imagePieces[i]}'>`
          console.log(tile)
          i++;
        }
      }
    }


      // for (let i = 0; i < imagePieces.length; i++) {
      //   const tile = document.querySelector(`#tile-${i}`);
      //   tile.innerHTML = `${i}<img src='${imagePieces[i]}'>`

      //   // const newImg = document.createElement('img')
      //   //   newImg.src = imagePieces[i]
      //   //   document.querySelector('p').append(newImg)
      // }
    }
    // ctx.drawImage(imgObj, 0, 0, widthOfOnePiece, heightOfOnePiece, -toCrop, 0, w, h)
    // ctx.drawImage(imgObj, 0, 1 * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, w, h)
    // ctx.drawImage(imgObj, 0, 2 * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, w, h)
    // ctx.drawImage(imgObj, 1 * widthOfOnePiece, 0, widthOfOnePiece, heightOfOnePiece, -toCrop, 0, w, h)
    // ctx.drawImage(imgObj, 1 * widthOfOnePiece, 1 * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, w, h)
    // ctx.drawImage(imgObj, 1 * widthOfOnePiece, 2 * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, w, h)



    // if (nh < nw) {
    //   // let's say nw is 2400
    //   // nh is 1600
    //   // actual w is 1200
    //   // actual h is 800
    //   // resize ratio is w / nw = .5 = 50%
    //   // so if we have w / nw
    //   // and we have nw - nh = 800
    //   // since the resize ratio is 50%, we need to crop 50% of nw - nh
    //   // which is (w / nw) (nw - nh)
    //   // and we crop half of that from each side
    //   // so (w / nw) (nw - nh) / 2

    //   const ratio = w / nw
    //   const difference = nw - nh;
    //   const toCrop = (ratio * difference) / 2;

    //   // otherwise the canvas is larger than the image
    //   canvas.width = w - (toCrop * 2);

    //   ctx.drawImage(imgObj, -toCrop, 0, w - toCrop, h);


    // } else {
    //   const ratio = h / nh
    //   const difference = nh - nw;
    //   const toCrop = (ratio * difference) / 2;

    //   canvas.height = h - (toCrop * 2);

    //   ctx.drawImage(imgObj, 0, -toCrop, w, h - toCrop);

    // }



  }

  // const cutImageUp = () => {
  //   let imagePieces = [];

  //   for(let x = 0; x < 3; ++x) {
  //     for(let y = 0; y < 3; ++y) {
  //         const heightOfOnePiece = widthOfOnePiece
  //         canvas.width = widthOfOnePiece;
  //         canvas.height = heightOfOnePiece;

  //         ctx.drawImage(imgObj, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, canvas.width, canvas.height);
  //         imagePieces.push(canvas.toDataURL());
  //     }
  //   }
  //   imgObj.src = imagePieces[4];
  // }
  cropImage();


})