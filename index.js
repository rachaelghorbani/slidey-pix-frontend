document.addEventListener('DOMContentLoaded', e => {
  const contentDiv = document.querySelector('#content');
  let userId;
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
  let scramblePos = {}
  
  const squareImg = (id, img_url, moves) => {
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

      newDiv.innerHTML = `
        <a href="#" class="d-block mb-4 h-100">
          <img class="img-fluid img-thumbnail" data-img-id=${id} src=${origCanvas.toDataURL()}>
        </a>
      `;

      document.querySelector('#thumbnails').append(newDiv);
      if (document.querySelector('h1').textContent === "Completed Puzzles") {
        const thumbDiv = document.querySelector('#thumbnails').lastElementChild;
        const movesP = document.createElement('p');
        movesP.className = 'text-blue';
        movesP.textContent = `Completed in ${moves} moves!`;
        thumbDiv.firstElementChild.append(movesP);
      }
    }
  };

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
        origCtx.drawImage(sqrImgObj, -origToCrop, 0, w - origToCrop, h);
      } else {
        const w = window.innerHeight;

        const aspect = nw / nh;
        const h = w / aspect;

        origCanvas.width = w;

        const ratio = h / nh;
        const difference = nh - nw;
        const origToCrop = (ratio * difference) / 2;
        origCanvas.height = h - (origToCrop * 2);

        origCtx.drawImage(sqrImgObj, 0, -origToCrop, w, h - origToCrop);
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
        for (let x = 0; x < 4; ++x) {
          for (let y = 0; y < 4; ++y) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const nh = imgObj.naturalHeight;

            canvas.height = window.innerHeight / 5;
            canvas.width = canvas.height;
            const heightOfOnePiece = nh / 4;
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

        const emptyTile = document.querySelector(`#tile-15`);
        emptyTile.innerHTML = '';
      }
    }
  }

  const addPuzzleGrid = () => {
    clearContent();
    const newDiv = document.createElement('div');
    newDiv.className = 'grid-container';
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
    while (contentDiv.childNodes[2]) {
      contentDiv.childNodes[2].remove();
    }
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
    galleryHead.className = "font-weight-light text-center text-lg-left mt-4 mb-0";
    galleryHead.textContent = `${headerTextContent}`;

    const galleryHr = document.createElement('hr');
    galleryHr.className = "mt-2 mb-5";

    const thumbnailDiv = document.createElement('div');
    thumbnailDiv.className = "row text-center text-lg-left";
    thumbnailDiv.id = "thumbnails";

    galleryContainer.append(galleryHead);
    galleryContainer.append(galleryHr);
    galleryContainer.append(thumbnailDiv);

    
    contentDiv.append(galleryContainer);
  }

  const getImages = (category) => {
    createGallery("Puzzle Gallery", "puzzle-gallery-container")


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
        // flag = true;
      }
    }
    if (flag === false) {
      squareImg(image.id, image.img_url);
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
            playPuzzle(e.target)
      }
      if (e.target.matches('.img-thumbnail')) {
            addPuzzleGrid()
            const imgId = e.target.dataset.imgId;
            renderSelectedImageAsPuzzle(imgId)
            const gridContainer = document.querySelector('.grid-container')
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
        scrambleTiles();
      } else if (e.target.matches('.create-puzzle')) {
            renderFormToCreateNewPuzzle(e.target)
      } else if (e.target.matches('.logout')) {
            logoutAndRerenderLoginForm()
      } else if (e.target.parentElement.parentElement.matches('#categorySubmenu')) {
            resetActiveNavBarElement(e.target)
            getImages(e.target.textContent)
      }
    })



    $('#exampleModal').on('hide.bs.modal', e => {
      const imgId = parseInt(document.querySelector('.grid-container').dataset.imgId, 10);
      renderLeaderboard(imgId);
      const imageGrid = document.querySelector('.grid-container')
    //    imageGrid.style.pointerEvents = 'none'
     
    })
  }

  const playPuzzle = el => {
    let emptyPosIndex = findEmptyTilePosition();
    let moveablePositions = moveableTilePositions(emptyPosIndex);

    if (moveablePositions.includes(parseInt(el.parentElement.parentElement.id, 10))) {
      const movesCounter = document.querySelector('#moves-counter')
      movesCounter.textContent = parseInt(movesCounter.textContent, 10) + 1;
      swapTiles(el.parentElement);
      isSolved()
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

    const formDiv = document.createElement('div')
    formDiv.innerHTML = `
      <form id="login">
      <label for="username">Username:</label>        
      <input type="textfield" name="username" value=""><br>
      <button type="submit" id="play">Play!</button>
      </form>
    `
    contentDiv.append(formDiv)
  }

  const renderFormToCreateNewPuzzle = el => {
    clearContent()
    resetActiveNavBarElement(el)

    const form = document.createElement('form')
    form.id = "add-image"
    const formDiv = document.createElement('div')
    formDiv.className = "form-group"
    const imgLabel = document.createElement('label')
    imgLabel.textContent = "Image URL: "
    imgLabel.for = "img_url"
    const submitButton = document.createElement('button')
    submitButton.textContent = "Create Puzzle!"
    submitButton.type = 'submit'


    const imgInput = document.createElement('input')
    imgInput.className = "form-control"
    imgInput.type = "text"
    imgInput.name = "img_url"

    formDiv.append(imgLabel)
    formDiv.append(imgInput)
    form.append(formDiv)
    form.append(submitButton)
    contentDiv.append(form)
  }

  const getAndDisplayCompletedPuzzles = el => {
    createGallery("Completed Puzzles","user-solved-puzzle-container" )

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
              solvedPuzzles.push(puzzleHash)
            }
          }
        }
        for (let puzzle of solvedPuzzles) {
          squareImg(puzzle.image_id, puzzle.img_url, puzzle.moves)
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
          category_id: categoryId
        }

        const options = {
          method: "POST",
          headers: headers,
          body: JSON.stringify(imgObj)
        }

        fetch("http://localhost:3000/images", options)
          .then(response => response.json())
          .then(json => {
            addPuzzleGrid();
            renderSelectedImageAsPuzzle(json.id)
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

  const renderSelectedImageAsPuzzle = imgId => {

   
    const imageGrid = document.querySelector('.grid-container')
    imageGrid.dataset.imgId = imgId
    const leaderboard = document.querySelector('.leaderboard-container')
    renderLeaderboard(imgId);
    leaderboard.hidden = false;

    const userImagesObj = {
      user_id: userId,
      image_id: imgId
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
        renderPuzzle(json.id, json.image.img_url);
          
      })
      
  }


  const renderPuzzle = (userImageId, puzzleUrl) => {
    const newDiv = document.createElement('div');
    newDiv.innerHTML = `
      <button id="scramble" class="btn btn-info color-rose">Scramble!</button>
      <p id="moves-container">Moves: <span id="moves-counter">0</span></p>
    `;
    const gridContainer = document.querySelector('.grid-container');

    contentDiv.insertBefore(newDiv, gridContainer);
    gridContainer.dataset.userImageId = userImageId;
    
    cropImage(puzzleUrl)
    
  };

  const findEmptyTilePosition = () => {
    return parseInt(document.getElementById('tile-15').parentElement.id, 10);
  };

  const moveableTilePositions = (emptyPosIndex) => {
    // above: -1, below: +1, left: -4, right: +4
    // if < 4, no left
    // if > 11, no right
    // if % 4 = 0, no above
    // if % 4 = 3, no below
    const gridSize = 16; // for custom grid sizes, just pass grid size as param and the rest will work
    const rowSize = Math.sqrt(gridSize);
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
    let posToPlace = tileToMove.parentElement;
    let emptyPosIndex = findEmptyTilePosition();
    let emptyTile = document.getElementById(`${emptyPosIndex}`).firstChild;

    emptyTile.remove();

    document.getElementById(`${emptyPosIndex}`).append(tileToMove);

    posToPlace.append(emptyTile);
  };

  const scrambleTiles = () => {
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

    // for (let i = 0; i < 100; i++) {
    //   let emptyPosIndex = findEmptyTilePosition();
    //   let moveablePositions = moveableTilePositions(emptyPosIndex);
    //   let positionToMoveIndex = Math.floor(Math.random() * moveablePositions.length);
    //   let tileToMove = document.getElementById(`${moveablePositions[positionToMoveIndex]}`).firstChild;

    //   swapTiles(tileToMove);
    // }
  };

  const isSolved = () => {
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
              .then(json => endOfGame());
          } else {
            endOfGame();
          }
        });
    }
  }

  const endOfGame = () => {
    const imgId = document.querySelector('.grid-container').dataset.imgId;

    fetch('http://localhost:3000/user_images')
      .then(response => response.json())
      .then(json => {
        const results = [];

        for (let userImage of json) {
          if (userImage.image_id == imgId && userImage.completed == true) {
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

        for (let i = 0; i < sortedResults.length; i++) {
          const row = document.createElement('tr');
          row.innerHTML = `
          <th scope="row">${i + 1}</th>
          <td>${sortedResults[i].username}</td>              
          <td>${sortedResults[i].moves}</td>
        `;
          leaderboard.append(row);
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
          if (userImage.image_id == imgId && userImage.completed == true) {
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

  clickHandler();
});