document.addEventListener('DOMContentLoaded', e => {
  console.log('loaded!')
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  let imgObj = new Image();
  imgObj.src = 'https://live.staticflickr.com/4443/37614774531_72a256658b_3k.jpg';

  imgObj.onload = function() {
    let w = canvas.width;
    let nw = imgObj.naturalWidth;
    let nh = imgObj.naturalHeight;

    // we actually DON'T want to force the canvas to be a square anymore
    // we want it to be a rectangle so we can crop out the sides manually
    let aspect = nw / nh
    let h = w / aspect;
    canvas.height = h;
    

    if (nh < nw) {
      // let's say nw is 2400
      // nh is 1600
      // actual w is 1200
      // actual h is 800
      // resize ratio is w / nw = .5 = 50%
      // so if we have w / nw
      // and we have nw - nh = 800
      // since the resize ratio is 50%, we need to crop 50% of nw - nh
      // which is (w / nw) (nw - nh)
      // and we crop half of that from each side
      // so (w / nw) (nw - nh) / 2

      const ratio = w / nw
      const difference = nw - nh;
      const toCrop = (ratio * difference) / 2;

      // otherwise the canvas is larger than the image
      canvas.width = w - (toCrop * 2);

      ctx.drawImage(imgObj, -toCrop, 0, w - toCrop, h)

    } else {
      const difference = h - w;
      const toCrop = difference / 2;

    }

    // ctx.drawImage(imgObj, 0, 0, h, h)
  }


 
})