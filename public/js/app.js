let allUsers = []
const toggleMenu = document.querySelector(".toggle-sidebar");
const userDataElem = document.querySelector('.users-data')
const userCaptionText = document.querySelector('.users-count-text.caption-text')
const startLoader = document.querySelector('.start-loader')
const resultModal = document.querySelector('.modal-result')
const resultModalMsg = resultModal.querySelector('.modal-text')
const tableBody = document.querySelector('.table-body')
const pagination = document.querySelector('.pagination')
const registerUserBtn = document.querySelector('#create-user')
const modalScreen = document.querySelector('.modal-screen')
const modalScreenTitle = modalScreen.querySelector('h3')
const modalScreenCancelBtn = modalScreen.querySelector('.cancel')
const modalScreenSubmitBtn = modalScreen.querySelector('.submit')
const modalScreenContent = modalScreen.querySelector('.modal-content')
const modalScreenCloseX = modalScreen.querySelector('.close-modal')
const modalScreenModal = modalScreen.querySelector('.modal')
const updateOverlay = document.querySelector('.update-overlay')
const updateAction = updateOverlay.querySelector('.update-action')
const toast = document.querySelector('.toast')
const toastContent = toast.querySelector('.toast-content')
const toastProcess = toast.querySelector('.process')
const themeButton = document.querySelector('.theme-button')
const limit = 3;
const baseUrl = 'https://js3proone-default-rtdb.firebaseio.com'
function showToast(msg){
  toastContent.textContent = msg
  toastProcess.style.width = '0px'
  toast.classList.remove('hidden')
  toastProcess.style.transition = 'width 3s linear'
  toastProcess.style.width = '100%'
  toastProcess.addEventListener('transitionend', () => {
    toast.classList.add('hidden')
    toastProcess.style.width = '0px'
    toastProcess.style.transition = 'none'
  },{once: true})
}
function hideModalScreen(){
  modalScreen.classList.add('hidden')
}
function reloadSiteHandler(){
  window.location.reload()
}
function hideSiteStartLoader(){
  startLoader.classList.add('hidden')
}
function showModalErrorServer(msg){
  resultModal.innerHTML = `
    <div class="modal-card">
      <!-- success.png, failed.png -->
      <img
          src="./public/images/failed.png"
          class="w-12 modal-img"
          alt="Logo"
      />
      <p class="modal-text">${msg}</p>

      <button class="modal-button" onclick="reloadSiteHandler()">تلاش دوباره</button>
    </div>
  `
  resultModal.classList.remove('hidden')
}
function setUserData(){
  const allUserCount = allUsers.length
  if (!allUserCount){
    userCaptionText.innerHTML = 'هنوز کاربری در سایت ثبت نام نکرده است.'
  }else {
    userDataElem.textContent = allUserCount.toLocaleString()
  }
}
function createUserTableRow(user){
  const newDiv = document.createElement('div')
  newDiv.className = 'tableRow'
  newDiv.innerHTML = `
    <p class="user-username">${user.username}</p>
    <p class="user-password">${user.password}</p>
    <div class="product-manage">
      <button class="edit-btn" data-id="${user.id}" data-username="${user.username}" data-password="${user.password}">
        <!-- Edit icon -->
        <i class="fas fa-edit"></i>
      </button>
      <button class="remove-btn" data-id="${user.id}">
        <!-- Ban icon -->
        <i class="fas fa-ban"></i>
      </button>
    </div>
  `
  return newDiv
}
function showUpdateOverlay(msg){
  updateAction.textContent = msg
  updateOverlay.classList.remove('hidden')
}
function hideUpdateOverlay(){
  updateAction.textContent = ''
  updateOverlay.classList.add('hidden')
}
function renderUsers(users){
  const fragmentElem = document.createDocumentFragment()
  tableBody.innerHTML = ''
  users.forEach(user => {
    fragmentElem.appendChild(createUserTableRow(user))
  })
  tableBody.appendChild(fragmentElem)
}
function createBtnPagination(index){
  const newSpan = document.createElement('span')
  newSpan.className = 'page'
  newSpan.setAttribute('tabindex', '1')
  newSpan.textContent = index.toLocaleString()
  return newSpan
}
function resetPagination(){
  pagination.innerHTML = ''
  const fragmentElem = document.createDocumentFragment()
  const btnCount = Math.ceil(allUsers.length / limit)
  if (btnCount > 1){
    for (let i = 1; i <= btnCount; i++) {
      fragmentElem.appendChild(createBtnPagination(i))
    }
    pagination.appendChild(fragmentElem)
  }
  return btnCount
}
function setActivePaginationBtn(index){
  const allBtn = document.querySelectorAll('.page')
  allBtn.forEach(btn => {
    btn.classList.remove('active')
  })
  allBtn[index].classList.add('active')
}
async function initApp(){
  try{
    const savedTheme = localStorage.getItem('localTheme')
    if (savedTheme !== null){
      if (savedTheme === 'dark'){
        themeButton.innerHTML = `
          <i class="fas fa-moon"></i>
        `
        document.documentElement.className = 'dark'
      }
    }
     allUsers = await getAllUsers()
    const selectedUsers = allUsers.slice(0, limit)
    setUserData()
    renderUsers(selectedUsers)
    const paginationBtnCount = resetPagination()
    if (paginationBtnCount > 1){
      setActivePaginationBtn(0)
    }
  }
  catch (err){
    showModalErrorServer('دسترسی به سرور با مشکل مواجه شد.')
  }
  finally {
    hideSiteStartLoader()
  }
}
async function getAllUsers(){
  const res = await fetch(`${baseUrl}/users.json`)
  if (!res.ok){
    throw new Error('دسترسی به سایت با مشکل مواجه شد.')
  }
  const data = await res.json()
  if (!data){
    return []
  }else {
    const usersArr = Object.entries(data).map(([id, user]) => {
      return {id, ...user}
    })
    return usersArr
  }
}

function registerUserHandler(){
  modalScreenTitle.textContent = 'ثبت نام'
  modalScreenContent.innerHTML = `
    <input
      type="text"
      class="modal-input"
      id="user-username"
      placeholder="نام کاربری را وارد نمائید ..."
    />
    <div style="position: relative">
        <input
          type="password"
          class="modal-input"
          id="user-password"
          placeholder="رمز عبور را وارد نمائید ..."
        />
        <button id="eye-button" data-type="password">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-7 11-7c2.3 0 4.4.6 6.1 1.7"></path>
              <path d="M23 12s-4 7-11 7c-2.3 0-4.4-.6-6.1-1.7"></path>
              <circle cx="12" cy="12" r="3" fill="#888" stroke="none"></circle>
              <line x1="3" y1="3" x2="21" y2="21"></line>
            </svg>
        </button>
    </div>
  `
  modalScreen.classList.remove('hidden')
  modalScreenSubmitBtn.onclick = null
  modalScreenSubmitBtn.onclick = async () => {
    const username = modalScreen.querySelector('#user-username').value.trim()
    const password = modalScreen.querySelector('#user-password').value.trim()
    if (!username){
      showErrorMessage('یوزرنیم خالی است.')
    }else if (!password){
      showErrorMessage('پسورد خالی است.')
    }else if (username.length < 3){
      showErrorMessage('یوزرنیم باید حدااقل 3 کاراکتر باشد.')
    }else if (!isValidUsername(username)){
      showErrorMessage('نام کاربری نامعتبر است. نام کاربری باید با حرف انگلیسی یا آندرلاین شروع شود و فقط می‌تواند شامل حروف انگلیسی، اعداد، نقطه، خط تیره و آندرلاین باشد.')
    }else if (!isValidPassword(password)){
      showErrorMessage('پسورد نامعتبر است.پسورد باید با حرف انگلیسی شروع شود و حدااقل شامل یک عدد و یک کاراکترخاص و یک حرف بزرگ انگلیسی باشد.')
    }else if (isExistUsername(username)){
      showErrorMessage('این نام کاربری قبلا ثبت نام کرده است.')
    }else {
      hideModalScreen()
      showUpdateOverlay('در حال ثبت نام کاربر جدید')
      const newUser = {
        username,
        password
      }
      try{
        await postNewUser(newUser)
        allUsers = await getAllUsers()
        console.log(allUsers)
        setUserData()
        const paginationBtnCount = resetPagination()
        const end = paginationBtnCount * limit
        const start = end - limit
        if (paginationBtnCount > 1){
          setActivePaginationBtn(paginationBtnCount - 1)
        }
        const selectedUsers = allUsers.slice(start, end)
        showToast('کاربر جدید با موفقیت ایجاد شد')
        renderUsers(selectedUsers)
      }
      catch (err){
        showModalErrorServer('متاسفانه ثبت نام کاربر با مشکل مواجه شد')
      }
      finally {
        hideUpdateOverlay()
      }
    }
  }
}
async function postNewUser(user){
  const res = await fetch(`${baseUrl}/users.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })

  if (!res.ok){
    throw new Error('دسترسی به سرور با مشکل مواجه شد.')
  }
}
function hideResultModal(){
  resultModal.classList.add('hidden')
}
function showErrorMessage(msg){
  resultModal.innerHTML = `
    <div class="modal-card">
      <!-- success.png, failed.png -->
      <img
              src="./public/images/failed.png"
              class="w-12 modal-img"
              alt="Logo"
      />
      <p class="modal-text">${msg}</p>

      <button class="modal-button" onclick="hideResultModal()">تائید</button>
    </div>
  `
  resultModal.classList.remove('hidden')
}
function isValidUsername(username) {
  const regex = /^[A-Za-z_][A-Za-z0-9._-]*$/;
  return regex.test(username);
}


function isValidPassword(password) {
  const regex = /^(?=[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_.?-])[A-Za-z\d!@#$%^&*_.?-]+$/;
  return regex.test(password);
}

function isExistUsername(username){
  return allUsers.some(user => {
    return user.username === username
  })
}
registerUserBtn.addEventListener('click', registerUserHandler)
modalScreenCancelBtn.addEventListener('click', hideModalScreen)
modalScreenCloseX.addEventListener('click', hideModalScreen)
document.documentElement.addEventListener('keyup', event => {
  if (event.key === 'Escape' && !modalScreen.classList.contains('hidden')){
    hideModalScreen()
  }
})
function editUserHandler(btn){
  console.log(btn)
  const currentId = btn.dataset.id
  const currentUsername = btn.dataset.username
  const currentPassword = btn.dataset.password
  modalScreenTitle.textContent = 'ویرایش کاربر'
  modalScreenContent.innerHTML = `
    <input
      type="text"
      class="modal-input"
      id="user-username"
      placeholder="نام کاربری را وارد نمائید ..."
    />
    <div style="position: relative">
        <input
          type="password"
          class="modal-input"
          id="user-password"
          placeholder="رمز عبور را وارد نمائید ..."
        />
        <button id="eye-button" data-type="password">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-7 11-7c2.3 0 4.4.6 6.1 1.7"></path>
              <path d="M23 12s-4 7-11 7c-2.3 0-4.4-.6-6.1-1.7"></path>
              <circle cx="12" cy="12" r="3" fill="#888" stroke="none"></circle>
              <line x1="3" y1="3" x2="21" y2="21"></line>
            </svg>
        </button>
    </div>
  `
  const inputUserName = modalScreen.querySelector('#user-username')
  const inputPassword = modalScreen.querySelector('#user-password')
  inputUserName.value = currentUsername
  inputPassword.value = currentPassword
  modalScreen.classList.remove('hidden')
  modalScreenSubmitBtn.onclick = null
  modalScreenSubmitBtn.onclick = async () => {
    const newUsername = inputUserName.value.trim()
    const newPassword = inputPassword.value.trim()
    if (!newUsername){
      showErrorMessage('یوزرنیم خالی است.')
    }else if (!newPassword){
      showErrorMessage('پسورد خالی است.')
    }else if (newUsername.length < 3){
      showErrorMessage('یوزرنیم باید حدااقل 3 کاراکتر باشد.')
    }else if (!isValidUsername(newUsername)){
      showErrorMessage('نام کاربری نامعتبر است. نام کاربری باید با حرف انگلیسی یا آندرلاین شروع شود و فقط می‌تواند شامل حروف انگلیسی، اعداد، نقطه، خط تیره و آندرلاین باشد.')
    }else if (!isValidPassword(newPassword)){
      showErrorMessage('پسورد نامعتبر است.پسورد باید با حرف انگلیسی شروع شود و حدااقل شامل یک عدد و یک کاراکترخاص و یک حرف بزرگ انگلیسی باشد.')
    }else if (isExistUsernameForEdit(currentId,newUsername)){
      showErrorMessage('این نام کاربری قبلا ثبت نام کرده است.')
    }else {
      const newUser = {
        username: newUsername,
        password: newPassword
      }
      hideModalScreen()
      showUpdateOverlay('در حال ویرایش کاربر')
      try {
        await editUser(newUser,currentId)
        allUsers = await getAllUsers()
        showToast('کاربر با موفقیت ویرایش شد')
        btn.closest('.tableRow').querySelector('.user-username').textContent = newUsername
        btn.closest('.tableRow').querySelector('.user-password').textContent = newPassword
        btn.dataset.username = newUsername
        btn.dataset.password = newPassword
      }
      catch (err){
        showModalErrorServer('ویرایش کاربر با مشکل مواجه شد')
      }
      finally {
        hideUpdateOverlay()
      }
    }
  }
}
async function editUser(user, id){
  const res = await fetch(`${baseUrl}/users/${id}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  if (!res.ok){
    throw new Error('متاسفانه ویرایش کاربر با مشکل مواجه شد.')
  }
}
function isExistUsernameForEdit(id, username){
  return allUsers.some(user => {
    if (user.id !== id){
      return user.username === username
    }
  })
}
async function removeUser(id){
  const res = await fetch(`${baseUrl}/users/${id}.json`,{
    method: 'DELETE'
  })
  if (!res.ok){
    throw new Error('دسترسی به سرور با مشکل مواجه شد')
  }
}
function removeUserHandler(id){
  modalScreenTitle.textContent = 'حذف کاربر'
  modalScreenContent.innerHTML = `
    <p class="remove-text">آیا از اخراج(بن) کردن این کاربر اطمینان دارید؟</p>
  `
  modalScreen.classList.remove('hidden')
  modalScreenSubmitBtn.onclick = null
  modalScreenSubmitBtn.onclick = async () => {
    hideModalScreen()
    showUpdateOverlay('در حال حذف کاربر')
    try{
      await removeUser(id)
      allUsers = await getAllUsers()
      const selectedUsers = allUsers.slice(0, limit)
      showToast('کاربر با موفقیت حذف شد')
      setUserData()
      renderUsers(selectedUsers)
      const paginationBtnCount = resetPagination()
      if (paginationBtnCount > 1){
        setActivePaginationBtn(0)
      }
    }
    catch (err){
      showModalErrorServer('متاسفانه حذف کاربر با مشکل مواجه شد')
    }
    finally {
      hideUpdateOverlay()
    }
  }
}
tableBody.addEventListener('click', event => {
  const targetEditUserBtn = event.target.closest(".edit-btn")
  const targetDeleteUserBtn = event.target.closest('.remove-btn')
  if (targetEditUserBtn){
    editUserHandler(targetEditUserBtn)
  }else if (targetDeleteUserBtn){
    const targetId = targetDeleteUserBtn.dataset.id
    removeUserHandler(targetId)
  }
})
/*modalScreen.addEventListener('click', event => {
  if (!event.target.closest('.modal-screen .modal') && !event.target.closest('#eye-button')){
    hideModalScreen()
  }
})*/
toggleMenu.addEventListener("click", function () {
  document.querySelector(".sidebar").classList.toggle("open");
});
pagination.addEventListener('click', event => {
  const targetBtn = event.target.closest('.page')
  if (targetBtn){
    const targetIndex = +targetBtn.textContent
    const end = targetIndex * limit
    const start = end - limit
    const selectedUsers = allUsers.slice(start, end)
    renderUsers(selectedUsers)
    setActivePaginationBtn(targetIndex - 1)
  }
})
modalScreenModal.addEventListener('click', event => {
  const targetEyeBtn = event.target.closest('#eye-button')
  if (targetEyeBtn){
    const inputElem = targetEyeBtn.parentElement.firstElementChild
    const currentInputType = inputElem.getAttribute('type')
    if (currentInputType === 'password'){
      inputElem.setAttribute('type', 'text')
      targetEyeBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"></path>
          <circle cx="12" cy="12" r="3" fill="#888" stroke="none"></circle>
        </svg>
      `
    }else {
      inputElem.setAttribute('type', 'password')
      targetEyeBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-7 11-7c2.3 0 4.4.6 6.1 1.7"></path>
              <path d="M23 12s-4 7-11 7c-2.3 0-4.4-.6-6.1-1.7"></path>
              <circle cx="12" cy="12" r="3" fill="#888" stroke="none"></circle>
              <line x1="3" y1="3" x2="21" y2="21"></line>
            </svg>
      `
    }
  }
})
themeButton.addEventListener('click', () => {
  const documentElem = document.documentElement
  const currentTheme = documentElem.className
  if (currentTheme === 'dark'){
    documentElem.classList.remove('dark')
    themeButton.innerHTML = `
      <i class="fas fa-sun"></i>
    `
    localStorage.setItem('localTheme', 'light')
  }else {
    documentElem.classList.add('dark')
    themeButton.innerHTML = `
      <i class="fas fa-moon"></i>
    `
    localStorage.setItem('localTheme', 'dark')
  }
})
document.addEventListener('DOMContentLoaded', async () => {
  await initApp()
});
