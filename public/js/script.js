const coursesCountElem = document.querySelector(".courses-count");
const coursesCountTopElem = document.querySelector(".courses-count-top");
const coursesContainer = document.querySelector(".table-body");

const showLastCourses = (courses) => {
  const lastCourses = courses.slice(-4);
  coursesCountElem.innerHTML = courses.length;

  lastCourses.forEach((course) => {
    coursesContainer.insertAdjacentHTML(
      "beforeend",
      `
            <div class="tableRow">
                <p class="product-title">${course.title}</p>
                <p class="product-price">${course.price.toLocaleString()}</p>
                <p class="product-shortName">${course.registersCount}</p>
                <div class="product-manage">
                  <button class="edit-btn" class="edit-btn">
                    <!-- Edit icon -->
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="remove-btn">
                    <!-- Delete fas icon -->
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
            </div>
      `
    );
  });
};

window.addEventListener("load", () => {
  fetch("https://js-cms.iran.liara.run/api/courses")
    .then((response) => response.json())
    .then((data) => {
      coursesCountTopElem.innerHTML = data.length;

      showLastCourses(data);
    });
});
