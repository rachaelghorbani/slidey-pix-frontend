document.addEventListener('DOMContentLoaded', e => {
  let userId;
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  
  const cropImage = () => {
    // take original image and make it square:

    // create a temp canvas for the square image
    const origCanvas = document.createElement('canvas');
    const origCtx = origCanvas.getContext('2d');

    // create the Image object we'll be using the canvas methods on
    const sqrImgObj = new Image();
    sqrImgObj.crossOrigin = "anonymous";
    sqrImgObj.src = 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format';

    // once the square Image is loaded
    sqrImgObj.onload = function () {

      // desired width to base square off of
      const w = 1200;

      // original image width and height so we can figure out the aspect ratio
      const nw = sqrImgObj.naturalWidth;
      const nh = sqrImgObj.naturalHeight;
      const aspect = nw / nh;
      const h = w / aspect;

      // now we can assign the height to the canvas (shorter side)
      origCanvas.height = h;

      // ratio helps us figure out how much to crop at various points
      const ratio = w / nw
      const difference = nw - nh;
      const origToCrop = (ratio * difference) / 2;
      origCanvas.width = w - (origToCrop * 2);

      // draw image with params: imgobj, sx, sy, swidth, sheight
      origCtx.drawImage(sqrImgObj, -origToCrop, 0, w - origToCrop, h);

      // now we make the Image object for the chopping we're about to do
      const imgObj = new Image();
      imgObj.crossOrigin = "anonymous";
      
      // VERY IMPORTANT LINE: turns square image canvas into a data URL and 
      // makes that the src for our imgObj we're about to chop
      imgObj.src = origCanvas.toDataURL();

      // once that imgObj is loaded
      imgObj.onload = function () {

        // array that will hold the chopped up pieces
        let imagePieces = [];

        // counter to help us stick the pieces in the appropriate places
        let i = 0;

        // nested loops go through the cells of the grid we're chopping into
        // starts at top left, moves down the column, then to the next column etc
        for (let x = 0; x < 3; ++x) {
          for (let y = 0; y < 3; ++y) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // these variables are same deal as above
            // not sure if we're supposed to have the consts here or just use lets above but it works so whatever
            const w = canvas.width;
            const nw = imgObj.naturalWidth;
            const nh = imgObj.naturalHeight;
            const aspect = nw / nh
            const h = w / aspect;
            canvas.height = h;
            const ratio = w / nw;
            const difference = nw - nh;
            const toCrop = (ratio * difference) / 2;
            canvas.width = w - (toCrop * 2)
            const heightOfOnePiece = nh / 3;
            const widthOfOnePiece = heightOfOnePiece;

            // since this is a 3x3 grid we need different params for each column
            // for a larger grid we would only need separate params for the first and last columns
            if (x === 0) {
              ctx.drawImage(imgObj, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, h, h);
            } else if (x === 1) {
              ctx.drawImage(imgObj, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, h, h);
            } else if (x === 2) {
              ctx.drawImage(imgObj, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, h, h);
            }

            // every new canvas gets pushed to the imagePieces array as a new element
            imagePieces.push(canvas.toDataURL());
            
            // find the next tile and stick the image in
            const tile = document.querySelector(`#tile-${i}`);
            tile.innerHTML = `${i}<img src='${imagePieces[i]}'>`;
            i++;
          }
        }
      }
    }
  }

  // call the function. much DRY very wow lol
  cropImage();

  $(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
  
  });

  document.addEventListener('submit', e => {
    e.preventDefault();
    if(e.target.matches('#login')){

      const username = e.target.username.value

      const userObj = {
        username: username
      }

      const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(userObj)
      }

      fetch('http://localhost:3000/users', options)
      .then(resp => resp.json())
      .then(console.log)
      
      // .then(user => console.log(user))

    }
  })


});

