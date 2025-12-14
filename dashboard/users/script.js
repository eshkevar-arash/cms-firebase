const usersContainer = document.querySelector(".table-body");

const fetchUsers = () => {
  const baseUrl = "https://js-course-sabzlearn-default-rtdb.firebaseio.com";

  fetch(`${baseUrl}/users.json`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const users = Object.values(data);
      showUsers(users);
    });
};

const showUsers = (users) => {
  console.log(users);

  users.forEach((user) => {
    usersContainer.insertAdjacentHTML(
      "beforeend",
      `
        <div class="tableRow">
          <p class="user-username">${user.username}</p>
          <p class="user-password">${user.password}</p>
          <div class="product-manage">
            <button class="edit-btn">
              <!-- Edit icon -->
              <i class="fas fa-edit"></i>
            </button>
            <button class="remove-btn">
              <!-- Ban icon -->
              <i class="fas fa-ban"></i>
            </button>
          </div>
        </div>
      `
    );
  });
};

window.addEventListener("load", fetchUsers);
