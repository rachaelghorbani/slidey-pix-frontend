document.addEventListener('DOMContentLoaded', e => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  
  let imgObj = new Image();
  imgObj.crossOrigin="anonymous";
  imgObj.src = 'https://live.staticflickr.com/4443/37614774531_72a256658b_3k.jpg';
  
  

  imgObj.onload = function() {
    let w = 1200;
    let nw = imgObj.naturalWidth;
    let nh = imgObj.naturalHeight;

    // we actually DON'T want to force the canvas to be a square anymore
    // we want it to be a rectangle so we can crop out the sides manually
    let aspect = nw / nh
    let h = w / aspect;
    canvas.height = h;
    

  

      const ratio = w / nw
      const difference = nw - nh;
      const toCrop = (ratio * difference) / 2;

      // otherwise the canvas is larger than the image
      canvas.width = w - (toCrop * 2);

      ctx.drawImage(imgObj, -toCrop, 0, w - toCrop, h);

  
    const squareImg = canvas.toDataURL();
    const newImg = document.createElement('img')
    newImg.src = squareImg
  
    document.querySelector('p').append(newImg)

  }



  // innerHTML = `<img src='${squareImg}'>`
})