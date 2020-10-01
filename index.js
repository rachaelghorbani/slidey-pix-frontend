document.addEventListener('DOMContentLoaded', e => {
  const contentDiv = document.querySelector('#content');

  let userId;
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
  let scramblePos = {}

  const squareImg = (id, img_url, category, moves, completed) => {
    const origCanvas = document.createElement('canvas');
    const origCtx = origCanvas.getContext('2d');
    // create the Image object we'll be using the canvas methods on
    const sqrImgObj = new Image();
    sqrImgObj.crossOrigin = "anonymous";
    sqrImgObj.src = img_url;

    // once the square Image is loaded
    sqrImgObj.onload = function () {
      const nw = sqrImgObj.naturalWidth;
      const nh = sqrImgObj.naturalHeight;
      if (nw >= nh) {
        // desired width to base square off of
        const h = 800;

        // original image width and height so we can figure out the aspect ratio

        const aspect = nw / nh;
        const w = h * aspect;

        // now we can assign the height to the canvas (shorter side)
        origCanvas.height = h;

        // ratio helps us figure out how much to crop at various points
        const ratio = w / nw;
        const difference = nw - nh;
        const origToCrop = (ratio * difference) / 2;
        origCanvas.width = w - (origToCrop * 2);

        // draw image with params: imgobj, sx, sy, swidth, sheight
        origCtx.drawImage(sqrImgObj, -origToCrop, 0, w, h);
      } else {
        const w = 800;

        const aspect = nw / nh;
        const h = w / aspect;

        origCanvas.width = w;

        const ratio = h / nh;
        const difference = nh - nw;
        const origToCrop = (ratio * difference) / 2;
        origCanvas.height = h - (origToCrop * 2);

        origCtx.drawImage(sqrImgObj, 0, -origToCrop, w, h);
      }
      const newDiv = document.createElement('div');
      newDiv.class = "col-lg-3 col-md-4 col-6";
      newDiv.style = "position: relative; text-align: center; color: white;"

      if (completed === true) {
        newDiv.innerHTML = `
          <a href="#" class="d-block mb-4 h-100">
            <img data-category=${category} class="img-fluid img-thumbnail" style="opacity: 0.5;" data-img-id=${id} src=${origCanvas.toDataURL()}>
            <p style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">completed</p>
          </a>
        `;
      } else {
        newDiv.innerHTML = `
          <a href="#" class="d-block mb-4 h-100">
            <img data-category=${category} class="img-fluid img-thumbnail" data-img-id=${id} src=${origCanvas.toDataURL()}>
          </a>
        `;
      }

      document.querySelector('#thumbnails').append(newDiv);
      if (document.querySelector('h1').textContent === "Completed Puzzles") {
        const thumbDiv = document.querySelector('#thumbnails').lastElementChild;
        const movesP = document.createElement('p');
        movesP.className = 'text-blue text-center';
        movesP.textContent = `Completed in ${moves} moves!`;
        thumbDiv.firstElementChild.append(movesP);
      }
    }
  };

  const cropImage = (imgUrl, gridSize) => {
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

      const nw = sqrImgObj.naturalWidth;
      const nh = sqrImgObj.naturalHeight;

      if (nw >= nh) {
        // desired height to base square off of
        const h = window.innerHeight;

        // original image width and height so we can figure out the aspect ratio
        const nw = sqrImgObj.naturalWidth;
        const nh = sqrImgObj.naturalHeight;
        const aspect = nw / nh;
        const w = h * aspect;

        // now we can assign the height to the canvas (shorter side)
        origCanvas.height = h;

        // ratio helps us figure out how much to crop at various points
        const ratio = w / nw;
        const difference = nw - nh;
        const origToCrop = (ratio * difference) / 2;
        origCanvas.width = w - (origToCrop * 2);

        // draw image with params: imgobj, sx, sy, swidth, sheight
        origCtx.drawImage(sqrImgObj, -origToCrop, 0, w, h);
      } else {
        const w = window.innerHeight;

        const aspect = nw / nh;
        const h = w / aspect;

        origCanvas.width = w;

        const ratio = h / nh;
        const difference = nh - nw;
        const origToCrop = (ratio * difference) / 2;
        origCanvas.height = h - (origToCrop * 2);

        origCtx.drawImage(sqrImgObj, 0, -origToCrop, w, h);
      }
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
        let i = 0;
        // nested loops go through the cells of the grid we're chopping into
        // starts at top left, moves down the column, then to the next column etc
        for (let x = 0; x < gridSize; ++x) {
          for (let y = 0; y < gridSize; ++y) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const nh = imgObj.naturalHeight;

            if (gridSize == 4) {
              canvas.height = window.innerHeight * .20;
            } else if (gridSize == 3) {
              canvas.height = window.innerHeight * .27;
            } else if (gridSize == 5) {
              canvas.height = window.innerHeight * .16;
            }
            canvas.width = canvas.height;
            const heightOfOnePiece = nh / gridSize;
            const widthOfOnePiece = heightOfOnePiece;

            ctx.drawImage(imgObj, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, canvas.width - 2, canvas.height - 2);

            // every new canvas gets pushed to the imagePieces array as a new element
            imagePieces.push(canvas.toDataURL());

            // find the next tile and stick the image in
            const tile = document.querySelector(`#tile-${i}`);
            tile.innerHTML = `<img src='${imagePieces[i]}'>`;
            i++;
          }
        }
        const emptyNum = gridSize * gridSize - 1;
        const emptyTile = document.querySelector(`#tile-${emptyNum}`);
        emptyTile.innerHTML = '';
      }
    }
  }

  const addPuzzleGrid = (gridSize = 4) => {
    clearContent();
    const newDiv = document.createElement('div');
    if (gridSize == 4) {
      newDiv.className = 'grid-container grid-size-4';
      newDiv.innerHTML = `
        <div class="grid-item" id="0"><div class="tile" id="tile-0"></div></div>
        <div class="grid-item" id="4"><div class="tile" id="tile-4"></div></div>
        <div class="grid-item" id="8"><div class="tile" id="tile-8"></div></div>
        <div class="grid-item" id="12"><div class="tile" id="tile-12"></div></div>

        <div class="grid-item" id="1"><div class="tile" id="tile-1"></div></div>
        <div class="grid-item" id="5"><div class="tile" id="tile-5"></div></div>
        <div class="grid-item" id="9"><div class="tile" id="tile-9"></div></div>
        <div class="grid-item" id="13"><div class="tile" id="tile-13"></div></div>

        <div class="grid-item" id="2"><div class="tile" id="tile-2"></div></div>
        <div class="grid-item" id="6"><div class="tile" id="tile-6"></div></div>
        <div class="grid-item" id="10"><div class="tile" id="tile-10"></div></div>
        <div class="grid-item" id="14"><div class="tile" id="tile-14"></div></div>

        <div class="grid-item" id="3"><div class="tile" id="tile-3"></div></div>
        <div class="grid-item" id="7"><div class="tile" id="tile-7"></div></div>
        <div class="grid-item" id="11"><div class="tile" id="tile-11"></div></div>
        <div class="grid-item" id="15"><div class="tile" id="tile-15"></div></div>
      `;
    } else if (gridSize == 3) {
      newDiv.className = 'grid-container grid-size-3';
      newDiv.innerHTML = `
      <div class="grid-item" id="0"><div class="tile" id="tile-0"></div></div>
      <div class="grid-item" id="3"><div class="tile" id="tile-3"></div></div>
      <div class="grid-item" id="6"><div class="tile" id="tile-6"></div></div>
      
      <div class="grid-item" id="1"><div class="tile" id="tile-1"></div></div>
      <div class="grid-item" id="4"><div class="tile" id="tile-4"></div></div>
      <div class="grid-item" id="7"><div class="tile" id="tile-7"></div></div>
    
      <div class="grid-item" id="2"><div class="tile" id="tile-2"></div></div>
      <div class="grid-item" id="5"><div class="tile" id="tile-5"></div></div>
      <div class="grid-item" id="8"><div class="tile" id="tile-8"></div></div>
      `;
    } else if (gridSize == 5) {
      newDiv.className = 'grid-container grid-size-5';

      newDiv.innerHTML = `
      <div class="grid-item" id="0"><div class="tile" id="tile-0"></div></div>
      <div class="grid-item" id="5"><div class="tile" id="tile-5"></div></div>
      <div class="grid-item" id="10"><div class="tile" id="tile-10"></div></div>
      <div class="grid-item" id="15"><div class="tile" id="tile-15"></div></div>
      <div class="grid-item" id="20"><div class="tile" id="tile-20"></div></div>

      <div class="grid-item" id="1"><div class="tile" id="tile-1"></div></div>
      <div class="grid-item" id="6"><div class="tile" id="tile-6"></div></div>
      <div class="grid-item" id="11"><div class="tile" id="tile-11"></div></div>
      <div class="grid-item" id="16"><div class="tile" id="tile-16"></div></div>
      <div class="grid-item" id="21"><div class="tile" id="tile-21"></div></div>

      <div class="grid-item" id="2"><div class="tile" id="tile-2"></div></div>
      <div class="grid-item" id="7"><div class="tile" id="tile-7"></div></div>
      <div class="grid-item" id="12"><div class="tile" id="tile-12"></div></div>
      <div class="grid-item" id="17"><div class="tile" id="tile-17"></div></div>
      <div class="grid-item" id="22"><div class="tile" id="tile-22"></div></div>

      <div class="grid-item" id="3"><div class="tile" id="tile-3"></div></div>
      <div class="grid-item" id="8"><div class="tile" id="tile-8"></div></div>
      <div class="grid-item" id="13"><div class="tile" id="tile-13"></div></div>
      <div class="grid-item" id="18"><div class="tile" id="tile-18"></div></div>
      <div class="grid-item" id="23"><div class="tile" id="tile-23"></div></div>

      <div class="grid-item" id="4"><div class="tile" id="tile-4"></div></div>
      <div class="grid-item" id="9"><div class="tile" id="tile-9"></div></div>
      <div class="grid-item" id="14"><div class="tile" id="tile-14"></div></div>
      <div class="grid-item" id="19"><div class="tile" id="tile-19"></div></div>
      <div class="grid-item" id="24"><div class="tile" id="tile-24"></div></div>
    `;
    }
    contentDiv.append(newDiv);
  };

  $(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
    });
  });

  const login = (user) => {
    const hiddenNavs = document.querySelectorAll('.hide-until-login');
    for (let nav of hiddenNavs) {
      nav.hidden = false;
    }
    document.querySelector('#login-nav').hidden = "true";
    document.querySelector('.hide-until-login').className = "hide-until-login active";
    userId = user.id;
    const form = document.querySelector('#login');
    form.hidden = true;
    getImages();
  };

  const clearContent = () => {
    document.querySelector('.leaderboard-container').hidden = true;
    removeChildren(contentDiv)
  }

  const removeChildren = parent => {
    while (parent.firstElementChild) {
      parent.firstElementChild.remove();
    }
  };

  const createGallery = (headerTextContent, idName) => {
    clearContent();

    const galleryContainer = document.createElement('div');
    galleryContainer.className = "gallery-container";
    galleryContainer.id = `${idName}`

    const galleryHead = document.createElement('h1');
    galleryHead.className = "font-weight-light text-center mt-4 mb-0";
    galleryHead.textContent = `${headerTextContent}`;


    const galleryHr = document.createElement('hr');
    galleryHr.className = "mt-2 mb-5";

    const thumbnailDiv = document.createElement('div');

    thumbnailDiv.className = "row text-center text-lg-left justify-content-center";

    thumbnailDiv.id = "thumbnails";

    galleryContainer.append(galleryHead);
    galleryContainer.append(galleryHr);
    galleryContainer.append(thumbnailDiv);


    contentDiv.append(galleryContainer);
  }

  const getImages = (category) => {
    if (typeof category === 'undefined') {
      createGallery("Puzzle Gallery", "puzzle-gallery-container");
    } else {
      createGallery(category, "puzzle-gallery-container");
    }


    fetch('http://localhost:3000/images')
      .then(resp => resp.json())
      .then(json => renderImages(json, category));
  };

  const renderImages = (images, category) => {
    for (let image of images) {
      if (image.owner === null || image.owner.id === userId) {
        if (typeof category !== 'undefined') {
          if (image.category.name === category.toLowerCase()) {
            renderImage(image);
          }
        } else {
          renderImage(image);
        }
      }
    }
  };

  const renderImage = (image) => {
    let flag = false;
    for (let user of image.users) {
      if (user.id === userId) {
        flag = true;
      }
    }
    if (flag === false) {
      squareImg(image.id, image.img_url, image.category.name);
    } else {
      let userCompleted = false;
      fetch('http://localhost:3000/user_images')
        .then(resp => resp.json())
        .then(json => {
          for (let userImage of json) {
            if (userImage.user_id == userId && userImage.image_id == image.id && userImage.completed == true) {
              userCompleted = true;
            }
          }
          squareImg(image.id, image.img_url, image.category.name, 0, userCompleted)
        })

    }
  }

  const clickHandler = () => {
    document.addEventListener('submit', e => {
      e.preventDefault();
      if (e.target.matches('#login')) {
        findOrCreateUserOnLoginAndRenderPuzzleGallery(e.target)
      } else if (e.target.matches('#add-image')) {
        addNewImage(e.target)
      }
    })
    document.addEventListener('click', e => {
      if (document.querySelector('.grid-container')) {
        const gridSize = parseInt(document.querySelector('.grid-container').dataset.gridSize, 10);
        playPuzzle(e.target, gridSize)
      }
      if (e.target.matches('.img-thumbnail')) {
        addPuzzleGrid()
        const imgId = e.target.dataset.imgId;
        const category = e.target.dataset.category


        renderSelectedImageAsPuzzle(imgId, category)

        // gridContainer.style.pointerEvents = 'none'

      } else if (e.target.matches('.completed-puzzles')) {
        getAndDisplayCompletedPuzzles(e.target)
      } else if (e.target.matches('.puzzle-gallery')) {
        resetActiveNavBarElement(e.target)
        getImages();
      } else if (e.target.matches('#scramble')) {
        const imageGrid = document.querySelector('.grid-container')
        // imageGrid.style.pointerEvents = 'auto'
        // movesCounter.hidden = false
        e.target.hidden = true;
        document.querySelector('#moves-container').hidden = false;
        const sizeButtons = document.querySelectorAll('.btn-group');
        for (let button of sizeButtons) {
          button.disabled = true;
        }
        const gridSize = parseInt(imageGrid.getAttribute('data-grid-size'), 10);
        scrambleTiles(gridSize);
      } else if (e.target.matches('.create-puzzle')) {
        renderFormToCreateNewPuzzle(e.target)
      } else if (e.target.matches('.logout')) {
        logoutAndRerenderLoginForm()
      } else if (e.target.parentElement.parentElement.matches('#categorySubmenu')) {
        resetActiveNavBarElement(e.target)
        getImages(e.target.textContent)
      } else if (e.target.parentElement.matches('.btn-group')) {
        const sizeChoice = parseInt(e.target.firstElementChild.id.split('-')[1]);
        const imageId = document.querySelector('.grid-container').dataset.imgId;
        const category = document.querySelector('.grid-container').dataset.category;
        clearContent();
        addPuzzleGrid(sizeChoice);
        renderSelectedImageAsPuzzle(imageId, category, sizeChoice);
        // change the size of the grid (using cropImage)
        // THEN, in the scramble clickhandler, put in a thing that checks for size
        // if size is 4, great, render the usual (persisted) scramble
        // otherwise, do the original scrambleTiles that moves stuff around
        // ALSO, make sure the moveableTilePositions and emptyTilePosition functions
        // know what to do with the other sizes
      }
    })



    $('#exampleModal').on('hide.bs.modal', e => {
      const imgId = parseInt(document.querySelector('.grid-container').dataset.imgId, 10);
      if (document.querySelector('.grid-container').getAttribute('data-grid-size') == 4) {
        renderLeaderboard(imgId);
      }
      const imageGrid = document.querySelector('.grid-container')
      //    imageGrid.style.pointerEvents = 'none'

    })
  }

  const playPuzzle = (el, gridSize) => {
    let emptyPosIndex = findEmptyTilePosition(gridSize);
    let moveablePositions = moveableTilePositions(emptyPosIndex, gridSize);

    if (moveablePositions.includes(parseInt(el.parentElement.parentElement.id, 10))) {
      const movesCounter = document.querySelector('#moves-counter')
      movesCounter.textContent = parseInt(movesCounter.textContent, 10) + 1;
      swapTiles(el.parentElement);
      isSolved(gridSize)
    }
  }

  const logoutAndRerenderLoginForm = () => {
    userId = ''
    clearContent()
    const toHide = document.querySelectorAll('.hide-until-login')
    for (let nav of toHide) {
      nav.hidden = true
    }
    const loginNav = document.querySelector('#login-nav')
    loginNav.hidden = false;

    const loginDiv = document.createElement('div')
    loginDiv.innerHTML = `
      <div class="container h-100">
        <div class="jumbotron justify-content-center ml-5">
          <h1 class="display-3 mb-5 text-blue">Welcome to Slidey Pix!</h1>
          <div class="row justify-content-center">
            <div class="mx-auto">
          
              <form class="form-inline" id="login">
                <div class="form-group mb-2">
                  <label for="username" class="form-label mr-3 text-blue">Username:</label>        
                  <input type="text" class="form-control" name="username" value="">
                
                <button type="submit" class="border-none btn btn-info ml-3 btn-lg color-rose" id="play">Play!</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `
    contentDiv.append(loginDiv)
  }

  const renderFormToCreateNewPuzzle = el => {
    clearContent()
    resetActiveNavBarElement(el)

    const formDiv = document.createElement('div')
    formDiv.innerHTML = `
      <div class="container h-100">
      <div class="jumbotron justify-content-center ml-5">
        <h1 class="display-5 mb-5 text-blue">Create Your Own Puzzle</h1>
        <div class="row justify-content-center">
          <div class="mx-auto">
        
            <form class="form-inline" id="add-image">
              <div class="form-group mb-2">
                <label for="img_url" class="form-label mr-3 text-blue">Image URL:</label>        
                <input type="text" class="form-control" name="img_url" value="">
              
              <button type="submit" class="border-none btn btn-info ml-3 btn-lg color-rose" id="create-puzzle">Create Puzzle!</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    `;
    contentDiv.append(formDiv)
  }

  const getAndDisplayCompletedPuzzles = el => {
    createGallery("Completed Puzzles", "user-solved-puzzle-container")

    resetActiveNavBarElement(el)
    const userCompletedPuzzles = document.querySelector('#user-solved-puzzle-container')
    userCompletedPuzzles.hidden = false


    const solvedPuzzleMovesAndId = []
    fetch(`http://localhost:3000/users/${userId}`)
      .then(response => response.json())
      .then(user => {
        for (let userImage of user.user_images) {
          if (userImage.completed === true) {
            const puzzleIdAndMoves = {}
            puzzleIdAndMoves.image_id = userImage.image_id
            puzzleIdAndMoves.moves = userImage.moves
            solvedPuzzleMovesAndId.push(puzzleIdAndMoves)
          }
        }
        const solvedPuzzles = []
        for (let puzzleHash of solvedPuzzleMovesAndId) {
          for (let image of user.images) {
            if (image.id === puzzleHash.image_id) {
              puzzleHash.img_url = image.img_url
              puzzleHash.category = image.category.name
              solvedPuzzles.push(puzzleHash)
            }
          }
        }
        for (let puzzle of solvedPuzzles) {
          squareImg(puzzle.image_id, puzzle.img_url, puzzle.category, puzzle.moves)
        }
      })
  }

  const findOrCreateUserOnLoginAndRenderPuzzleGallery = el => {
    const username = el.username.value

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

  const addNewImage = el => {
    clearContent()
    fetch('http://localhost:3000/categories')
      .then(resp => resp.json())
      .then(json => {
        let categoryId;
        for (let category of json) {
          if (category.name === "my custom puzzles") {
            categoryId = category.id;
          }
        }
        const form = el

        const imgObj = {
          img_url: form.img_url.value,
          user_id: userId,
          category_id: categoryId,
        }

        const options = {
          method: "POST",
          headers: headers,
          body: JSON.stringify(imgObj)
        }

        fetch("http://localhost:3000/images", options)
          .then(response => response.json())
          .then(json => {
            console.log(json)
            addPuzzleGrid();
            renderSelectedImageAsPuzzle(json.id, json.category.name)
          })
      })
  }

  const resetActiveNavBarElement = el => {
    const navElements = document.querySelectorAll('.nav-link');
    for (let element of navElements) {
      if (element.parentElement.matches('.active')) {
        element.parentElement.classList.remove('active');
      }
    }
    el.parentElement.classList.add('active');
  };

  const renderSelectedImageAsPuzzle = (imgId, category, gridSize = 4) => {


    const imageGrid = document.querySelector('.grid-container')
    imageGrid.dataset.imgId = imgId

    imageGrid.dataset.category = category
    const leaderboard = document.querySelector('.leaderboard-container')

    if (!imageGrid.dataset.category.includes("my") && gridSize == 4) {
      if (leaderboard.querySelector('p')) {
        leaderboard.querySelector('p').remove();
      }
      renderLeaderboard(imgId);
      leaderboard.hidden = false;
      leaderboard.querySelector('table').hidden = false;
    } else if (imageGrid.dataset.category.includes("my")) {
      if (leaderboard.querySelector('p')) {
        leaderboard.querySelector('p').remove();
      }
      leaderboard.hidden = false;
      const newP = document.createElement('p');
      newP.className = 'pad-left small em';
      newP.innerHTML = `
        Sorry, no leaderboard is available for custom puzzles.
      `;
      leaderboard.querySelector('table').hidden = true;
      leaderboard.append(newP);
    } else if (gridSize != 4) {
      if (leaderboard.querySelector('p')) {
        leaderboard.querySelector('p').remove();
      }
      leaderboard.hidden = false;
      const newP = document.createElement('p');
      newP.className = 'pad-left small em';
      newP.innerHTML = `
        Sorry, no leaderboard is available for custom grid sizes.
      `;
      leaderboard.querySelector('table').hidden = true;
      leaderboard.append(newP);
    }

    const userImagesObj = {
      user_id: userId,
      image_id: imgId,
      grid_size: gridSize
    };

    const options = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(userImagesObj)
    };

    fetch('http://localhost:3000/user_images/', options)
      .then(response => response.json())
      .then(json => {
        scramblePos = json.image.scramble_pos
        renderPuzzle(json.id, json.image.img_url, gridSize);

      })

  }


  const renderPuzzle = (userImageId, puzzleUrl, gridSize) => {
    const newDiv = document.createElement('div');
    newDiv.id = 'game-info'
    newDiv.className = "d-flex flex-row"
    newDiv.innerHTML = `
      <div class="d-flex w-50 justify-content-between">
      <p id="moves-container" class="text-center text-blue">Moves: <span id="moves-counter">0</span></p>
      <button id="scramble" class="btn btn-sm btn-info color-rose border-none">Scramble!</button>
      <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label class="btn btn-secondary btn-sm color-rose">
              <input type="radio" name="options" id="grid-3" autocomplete="off"> 3x3 Grid
          </label>
          <label class="btn btn-secondary btn-sm color-rose">
              <input type="radio" name="options" id="grid-4" autocomplete="off"> 4x4 Grid
          </label>
          <label class="btn btn-secondary btn-sm color-rose">
              <input type="radio" name="options" id="grid-5" autocomplete="off"> 5x5 Grid
          </label>
      </div>
      </div>
    `;
    const activeButton = newDiv.querySelector(`#grid-${gridSize}`)
    activeButton.checked = true;
    activeButton.parentElement.classList.add('active');
    newDiv.firstElementChild.firstElementChild.hidden = true;
    const gridContainer = document.querySelector('.grid-container');

    contentDiv.insertBefore(newDiv, gridContainer);
    gridContainer.dataset.userImageId = userImageId;
    gridContainer.dataset.gridSize = gridSize;

    cropImage(puzzleUrl, gridSize)

  };

  const findEmptyTilePosition = (gridSize) => {
    const emptyNum = gridSize * gridSize - 1;
    return parseInt(document.getElementById(`tile-${emptyNum}`).parentElement.id, 10);
  };

  const moveableTilePositions = (emptyPosIndex, rowSize) => {
    // above: -1, below: +1, left: -4, right: +4
    // if < 4, no left
    // if > 11, no right
    // if % 4 = 0, no above
    // if % 4 = 3, no below
    const gridSize = rowSize * rowSize; // for custom grid sizes, just pass grid size as param and the rest will work
    const allowedPos = [];
    if (emptyPosIndex >= rowSize) {
      allowedPos.push(emptyPosIndex - rowSize);
    }
    if (emptyPosIndex <= gridSize - 1 - rowSize) {
      allowedPos.push(emptyPosIndex + rowSize);
    }
    if (emptyPosIndex % rowSize != 0) {
      allowedPos.push(emptyPosIndex - 1);
    }
    if (emptyPosIndex % rowSize != rowSize - 1) {
      allowedPos.push(emptyPosIndex + 1);
    }
    return allowedPos;
  };

  const swapTiles = (tileToMove) => {
    let gridSize = parseInt(document.querySelector('.grid-container').dataset.gridSize, 10);
    let posToPlace = tileToMove.parentElement;
    let emptyPosIndex = findEmptyTilePosition(gridSize);
    let emptyTile = document.getElementById(`${emptyPosIndex}`).firstChild;

    emptyTile.remove();

    document.getElementById(`${emptyPosIndex}`).append(tileToMove);

    posToPlace.append(emptyTile);
  };

  const scrambleTiles = (gridSize) => {
    if (gridSize == 4) {
      let imagePieces = [];
      for (let piece of document.querySelectorAll('img')) {
        imagePieces[parseInt(piece.parentElement.id.split("-")[1], 10)] = piece;
        imagePieces[15] = ''
      }

      for (let position in scramblePos) {
        const positionDiv = document.getElementById(`${position}`);
        removeChildren(positionDiv);
        const tile = document.createElement(`div`);
        tile.className = 'tile';
        tile.id = `tile-${scramblePos[position]}`;
        tile.append(imagePieces[scramblePos[position]]);
        positionDiv.append(tile)
      }
      returnGrid(scramblePos)
    } else {
      for (let i = 0; i < 100; i++) {
        let emptyPosIndex = findEmptyTilePosition(gridSize);
        let moveablePositions = moveableTilePositions(emptyPosIndex, gridSize);
        let positionToMoveIndex = Math.floor(Math.random() * moveablePositions.length);
        let tileToMove = document.getElementById(`${moveablePositions[positionToMoveIndex]}`).firstElementChild;
        swapTiles(tileToMove);
      }
    }

  };

  const isSolved = (gridSize) => {
    const gridItems = document.querySelectorAll('.grid-item');
    let flag = true;
    for (let position of gridItems) {
      const tileIdLengthToGet = position.firstElementChild.id.length + 5;
      const tileId = position.firstElementChild.id.slice(5, `${tileIdLengthToGet}`);

      if (position.id !== tileId) {
        flag = false;
      }
    }
    if (flag === true) {
      const userImageId = document.querySelector('.grid-container').dataset.userImageId;
      const latestMoves = parseInt(document.querySelector('#moves-counter').innerText, 10);

      fetch(`http://localhost:3000/user_images/${userImageId}`)
        .then(response => response.json())
        .then(json => {
          if ((json.moves > 0 && latestMoves < json.moves) || json.moves == 0) {
            const userImageObj = {
              moves: latestMoves,
              completed: true
            }
            const options = {
              method: "PATCH",
              headers: headers,
              body: JSON.stringify(userImageObj)
            }
            fetch(`http://localhost:3000/user_images/${userImageId}`, options)
              .then(response => response.json())
              .then(json => endOfGame(gridSize));
          } else {
            endOfGame(gridSize);
          }
        });
    }
  }

  const endOfGame = (gridSize) => {
    const imgId = document.querySelector('.grid-container').dataset.imgId;

    fetch('http://localhost:3000/user_images')
      .then(response => response.json())
      .then(json => {
        const results = [];

        for (let userImage of json) {
          if (userImage.image_id == imgId && userImage.completed == true && userImage.grid_size == gridSize) {
            results.push({
              "username": userImage.user.username,
              "moves": userImage.moves
            });
          }
        }

        const sortedResults = results.sort(function (a, b) {
          return (a.moves > b.moves) ? 1 : -1;
        });

        const leaderboard = document.querySelector('#modal-tbody');

        removeChildren(leaderboard)
        const imageGrid = document.querySelector('.grid-container')
        if (!imageGrid.dataset.category.includes("my") && gridSize == 4) {
          leaderboard.parentElement.parentElement.parentElement.hidden = false;
          for (let i = 0; i < sortedResults.length; i++) {
            const row = document.createElement('tr');
            row.innerHTML = `
            <th scope="row">${i + 1}</th>
            <td>${sortedResults[i].username}</td>              
            <td>${sortedResults[i].moves}</td>
          `;
            leaderboard.append(row);
          }
        } else {
          leaderboard.parentElement.parentElement.parentElement.hidden = true;
        }
      })

    const modalButton = document.querySelector('#show-modal');
    modalButton.click();
  }

  const renderLeaderboard = imgId => {
    const leaderboard = document.querySelector('#ul-tbody');
    removeChildren(leaderboard);

    fetch('http://localhost:3000/user_images')
      .then(response => response.json())
      .then(json => {
        const results = [];
        for (let userImage of json) {
          if (userImage.image_id == imgId && userImage.completed == true && userImage.grid_size == 4) {
            results.push({
              "username": userImage.user.username,
              "moves": userImage.moves
            });
          }
        }
        const sortedResults = results.sort(function (a, b) {
          return (a.moves > b.moves) ? 1 : -1;
        });
        const leaderboard = document.querySelector('#ul-tbody')
        for (let i = 0; i < sortedResults.length; i++) {
          const row = document.createElement('tr');
          row.innerHTML = `
          <th scope="row">${i + 1}</th>
          <td>${sortedResults[i].username}</td>              
          <td>${sortedResults[i].moves}</td>
        `;
          leaderboard.append(row);
        }
      });
  };

  const returnGrid = () => {
    // 0: 8
    // 1: 0
    // 2: 2
    // 3: 1
    // 4: 4
    // 5: 15
    // 6: 5
    // 7: 3
    // 8: 9
    // 9: 13
    // 10: 7
    // 11: 11
    // 12: 12
    // 13: 10
    // 14: 6
    // 15: 14
    for (let position in scramblePos) {
      if (scramblePos[position] == 15) {
        scramblePos[position] = 0;
      } else {
        scramblePos[position]++;
      }
    }
    // 0 4 8  12
    // 1 5 9  13
    // 2 6 10 14
    // 3 7 11 15
    // 
    // 0  1  2  3
    // 4  5  6  7
    // 8  9  10 11
    // 12 13 14 15
    const grid = {
      0: [scramblePos[0], scramblePos[4], scramblePos[8], scramblePos[12]], 
      1: [scramblePos[1], scramblePos[5], scramblePos[9], scramblePos[13]], 
      2: [scramblePos[2], scramblePos[6], scramblePos[10], scramblePos[14]], 
      3: [scramblePos[3], scramblePos[7], scramblePos[11], scramblePos[15]]
    }
    console.log(grid)
    return grid;
  }

  clickHandler();
});