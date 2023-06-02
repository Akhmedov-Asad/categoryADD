const categoriesRow = document.querySelector(".categories-row");
const categoryForm = document.querySelector(".category-form");
const categoryModal = document.querySelector("#categoryModal");
const categoryName = categoryForm.querySelector("#name");
const categoryImage = categoryForm.querySelector("#image");
const searchInput = document.querySelector("#search");
const addButton = document.querySelector("#add-button");
const modalSave = document.querySelector(".modal-save");
let searchCategory = "";
let selected = null;

const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
});
if (localStorage.getItem('dark-mode') === 'true') {
  document.body.classList.add('dark-mode');
}

function getCategoryCard({ image, name, id }) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
      <div class="card">
        <img src="${image}" class="card-img-top" alt="..." />
        <div class="card-body">
          <h5 class="card-title">${name}</h5>
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#categoryModal" onClick="editCategory(${id})">Edit ${id}</button>
          <button class="btn btn-danger" onClick="deleteCategory(${id})">Delete ${id}</button>
        </div>
      </div>
    </div>
  `;
}

const getCategories = async () => {
  categoriesRow.innerHTML = "...loading";
  let res = await fetch(ENDPOINT + `category?name=${searchCategory}`);
  let data = await res.json();
  categoriesRow.innerHTML = "";
  data.forEach((category) => {
    categoriesRow.innerHTML += getCategoryCard(category);
  });
};

getCategories();

categoryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let obj = {
    name: categoryName.value,
    image: categoryImage.value,
  };
  if (categoryForm.checkValidity()) {
    if (selected) {
      fetch(ENDPOINT + `category/${selected}`, {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: { "Content-Type": "application/json" },
      }).then(() => {
        getCategories();
      });
    } else {
      fetch(ENDPOINT + "category", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: { "Content-Type": "application/json" },
      }).then(() => {
        getCategories();
      });
    }
    bootstrap.Modal.getInstance(categoryModal).hide();
  } else {
    categoryForm.classList.add("was-validated");
  }
});

addButton.addEventListener("click", () => {
  selected = null;
  categoryName.value = "";
  categoryImage.value = "";
  modalSave.innerHTML = "Add category";
});

searchInput.addEventListener("input", function () {
  searchCategory = this.value;
  getCategories();
});

function deleteCategory(id) {
  let isDeleted = confirm("Do you want delete this item ?");
  if (isDeleted) {
    fetch(ENDPOINT + `category/${id}`, { method: "DELETE" }).then(() => {
      getCategories();
    });
  }
}

const editCategory = async (id) => {
  selected = id;
  let res = await fetch(ENDPOINT + `category/${id}`);
  let data = await res.json();
  categoryName.value = data.name;
  categoryImage.value = data.image;
  modalSave.innerHTML = "Save category";
};