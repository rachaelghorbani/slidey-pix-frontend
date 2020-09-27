document.addEventListener('DOMContentLoaded', e => {
  let userId;
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  
  const cropImage = (imgUrl) => {
    // take original image and make it square:

    // create a temp canvas for the square image
    const origCanvas = document.createElement('canvas');
    const origCtx = origCanvas.getContext('2d');

    // create the Image object we'll be using the canvas methods on
    const sqrImgObj = new Image();
    sqrImgObj.crossOrigin = "anonymous";
    sqrImgObj.src = imgUrl;

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

            ctx.drawImage(imgObj, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, h, h);

            // every new canvas gets pushed to the imagePieces array as a new element
            imagePieces.push(canvas.toDataURL());
            
            // find the next tile and stick the image in
            const tile = document.querySelector(`#tile-${i}`);
            tile.innerHTML = `<img src='${imagePieces[i]}'>`;
            i++;
          }
        }
        const emptyTile = document.querySelector(`#tile-8`);
        emptyTile.innerHTML = '';
      }
    }
  }


  $(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
  
  });

  
  const login = (user) => {
    userId = user.id;
    const form = document.querySelector('#login')
    form.hidden = true
    getImages();
  };

  const getImages = () => {
    fetch('http://localhost:3000/images')
      .then(resp => resp.json())
      .then(json => renderImages(json))
  };

  const renderImages = (images) => {
    document.querySelector('.puzzle-container').hidden = false;
    for (let image of images) {
      renderImage(image);
    }
  };

  const renderImage = (image) => {
    let flag = false;
    for (let user of image.users) {
      if (user.id === userId) {
        // flag = true
      }
    }
    if (flag === false) {
      squareImg(image.id, image.img_url);
    }
  }

  const squareImg = (id, img_url) => {
    const origCanvas = document.createElement('canvas');
    const origCtx = origCanvas.getContext('2d');

    // create the Image object we'll be using the canvas methods on
    const sqrImgObj = new Image();
    sqrImgObj.crossOrigin = "anonymous";
    sqrImgObj.src = img_url;

    // once the square Image is loaded
    sqrImgObj.onload = function () {

      // desired width to base square off of
      const h = 800;

      // original image width and height so we can figure out the aspect ratio
      const nw = sqrImgObj.naturalWidth;
      const nh = sqrImgObj.naturalHeight;
      const aspect = nw / nh;
      const w = h * aspect;

      // now we can assign the height to the canvas (shorter side)
      origCanvas.height = h;

      // ratio helps us figure out how much to crop at various points
      const ratio = w / nw
      const difference = nw - nh;
      const origToCrop = (ratio * difference) / 2;
      origCanvas.width = w - (origToCrop * 2);

      // draw image with params: imgobj, sx, sy, swidth, sheight
      origCtx.drawImage(sqrImgObj, -origToCrop, 0, w - origToCrop, h);

      const newDiv = document.createElement('div');
      newDiv.class = "col-lg-3 col-md-4 col-6";

      newDiv.innerHTML = `
        <a href="#" class="d-block mb-4 h-100">
          <img class="img-fluid img-thumbnail" data-img-id=${id} src=${origCanvas.toDataURL()}>
        </a>
      `;

      document.querySelector('#thumbnails').append(newDiv);
    }
  };

  const clickHandler = () => {
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
        .then(json => login(json))
  
      }
    })

    
  
    document.addEventListener('click', e => {
      if(e.target.matches('#showPuzzle')){
        const showPuzzleButton = document.querySelector('#showPuzzle')
        showPuzzleButton.hidden = true
        const scramblePuzzleButton = document.querySelector('#scramble');
        scramblePuzzleButton.hidden = false;
        const gridContainer = document.querySelector('.grid-container')
        gridContainer.hidden = false
      } else if (e.target.matches('.img-thumbnail')) {
        const imgId = e.target.dataset.imgId;
        const imageGrid = document.querySelector('.grid-container')
        imageGrid.dataset.imgId = imgId
        const leaderboard = document.querySelector('.leaderboard-container')
        renderLeaderboard(imgId);
        leaderboard.hidden = false

        const userImagesObj = {
          user_id: userId,
          image_id: imgId
        }

        const options = {
          method: "POST",
          headers: headers,
          body: JSON.stringify(userImagesObj)
        }
        
        fetch('http://localhost:3000/user_images/', options)
        .then(response => response.json())
        .then(json => {
          renderPuzzle(json.id, json.image.img_url);
        })
      }
    })
  }

  const renderPuzzle = (userImageId, puzzleUrl) => {
    const imageGallery = document.querySelector('.puzzle-container');
    imageGallery.hidden = true;
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.dataset.userImageId = userImageId
    gridContainer.hidden = false;
    const scrambleButton = document.querySelector('#scramble')
    scrambleButton.hidden = false
    cropImage(puzzleUrl)

  }


  const findEmptyTilePosition = () => {
    return parseInt(document.querySelector('#tile-8').parentElement.id, 10)
  };

  const moveableTilePositions = (emptyPosIndex) => {
    // this is a 3x3 grid. should be fairly easy to manually dictate which tiles you can move based on emptyPosIndex.
    // to generalize this to any grid, we would need to find the corners
    // and each side. set different rules for each category: corner, each side, middle
    // not worth it for a grid of 9, but for a grid of 25 for example we could totally do it
    switch(emptyPosIndex) {
      case 0:
        return [1, 3];
      case 1:
        return [0, 2, 4];
      case 2:
        return [1, 5];
      case 3:
        return [0, 4, 6];
      case 4:
        return [1, 3, 5, 7];
      case 5:
        return [2, 4, 8];
      case 6:
        return [3, 7];
      case 7:
        return [4, 6, 8];
      case 8:
        return [5, 7];
    }
  };

  const swapTiles = (tileToMove) => {
    let posToPlace = tileToMove.parentElement;

    let emptyPosIndex = findEmptyTilePosition();

    let emptyTile = document.getElementById(`${emptyPosIndex}`).firstChild;

    document.getElementById(`${emptyPosIndex}`).firstChild.remove();

    document.getElementById(`${emptyPosIndex}`).append(tileToMove);

    posToPlace.append(emptyTile);
  };

  const scrambleTiles = () => {
    for (let i = 0; i < 100; i++) {
      
      let emptyPosIndex = findEmptyTilePosition();

      let moveablePositions = moveableTilePositions(emptyPosIndex);

      let positionToMoveIndex = Math.floor(Math.random() * moveablePositions.length);

      let tileToMove = document.getElementById(`${moveablePositions[positionToMoveIndex]}`).firstChild;

      swapTiles(tileToMove)
    }
  };

  const moveClickHandler = () => {
    document.addEventListener('click', e => {
      let emptyPosIndex = findEmptyTilePosition();

      let moveablePositions = moveableTilePositions(emptyPosIndex);

      if (moveablePositions.includes(parseInt(e.target.parentElement.parentElement.id, 10))) {
        const movesCounter = document.querySelector('#moves-counter')
        movesCounter.textContent = parseInt(movesCounter.textContent, 10) + 1;
        swapTiles(e.target.parentElement);
        isSolved()
      } else if (e.target.matches('#scramble')) {
        const movesCounter = document.querySelector('#moves-container')
        // movesCounter.hidden = false
        scrambleTiles();
      }
    });
  };

  const isSolved = () => {
    const gridItems = document.querySelectorAll('.grid-item')
    let flag = true;
    for(let position of gridItems){
        const tileId = position.firstElementChild.id.charAt(position.firstElementChild.id.length - 1)
      if(position.id != tileId){
        flag = false;
      }
    }
    if(flag === true){
      const userImageId = document.querySelector('.grid-container').dataset.userImageId
      const moves = parseInt(document.querySelector('#moves-counter').innerText, 10)

      
      const userImageObj = {
        moves: moves,
        completed: true
      }
      const options = {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(userImageObj)
      }

      fetch(`http://localhost:3000/user_images/${userImageId}`, options)
      .then(response => response.json())
      .then(json => endOfGame())


    }
  }

  const endOfGame = () => {
    const modalBody = document.querySelector(".modal-body");
    const imgId = document.querySelector('.grid-container').dataset.imgId;
    
    fetch('http://localhost:3000/user_images')
    .then(response => response.json())
    .then(json => {
      const results = [];
      for(let userImage of json){
        if(userImage.image_id == imgId && userImage.completed == true){
          results.push({
            "username": userImage.user.username,
            "moves": userImage.moves
          })
        }
      }
      const sortedResults = results.sort(function(a, b) {
        return (a.moves > b.moves) ? 1 : -1;
      });
      const leaderboard = document.querySelector('#modal-tbody')
      for(let i = 0; i < sortedResults.length; i++){
        const row = document.createElement('tr')
        row.innerHTML = `
          <th scope="row">${i + 1}</th>
          <td>${sortedResults[i].username}</td>              
          <td>${sortedResults[i].moves}</td>
        `
        leaderboard.append(row)
      }
    })

    const modalButton = document.querySelector('#show-modal');
    modalButton.click();
  }

  const renderLeaderboard = imgId => {
    fetch('http://localhost:3000/user_images')
    .then(response => response.json())
    .then(json => {
      const results = [];
      for(let userImage of json){
        if(userImage.image_id == imgId && userImage.completed == true){
          results.push({
            "username": userImage.user.username,
            "moves": userImage.moves
          })
        }
      }
      const sortedResults = results.sort(function(a, b) {
        return (a.moves > b.moves) ? 1 : -1;
      });
      const leaderboard = document.querySelector('#ul-tbody')
      for(let i = 0; i < sortedResults.length; i++){
        const row = document.createElement('tr')
        row.innerHTML = `
          <th scope="row">${i + 1}</th>
          <td>${sortedResults[i].username}</td>              
          <td>${sortedResults[i].moves}</td>
        `
        leaderboard.append(row)
       
      }
    })
  }

  clickHandler();
  moveClickHandler();

});

