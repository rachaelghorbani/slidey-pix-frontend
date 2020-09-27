document.addEventListener('DOMContentLoaded', e => {

  let userId;
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }

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
    for (let image of images) {
      renderImage(image);
    }
  };

  const renderImage = (image) => {
    let flag = false;
    for (let user of image.users) {
      if (user.id === userId) {
        flag = true
      }
    }
    if (flag === false) {
      const newImg = document.createElement('img');
      newImg.src = image.img_url;
      newImg.height = 600;
      document.querySelector('#content').append(newImg);
    }

  }

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
  }

  clickHandler();
})