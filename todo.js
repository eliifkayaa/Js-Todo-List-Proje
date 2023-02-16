//Tüm elementleri seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody =document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() {
    //Tüm event listenerlar
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos(e) {
    
    if (confirm("Tümünü silmek istediğinize emin misiniz?")) {
    //Arayüzden todoları temizleme
    // todoList.innerHTML = "";
    
    while(todoList.firstElementChild != null) {
        todoList.removeChild(todoList.firstElementChild);
    }
    localStorage.removeItem("todos"); //localstorage den silme
    }
}

function filterTodos(e) {
    // console.log(e.target.value);
    const filterValue = e.target.value.toLowerCase();
    const listItem = document.querySelectorAll(".list-group-item");

    listItem.forEach(function(listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            //Bulamadı
            listItem.setAttribute("style", "display: none !important");
        }
        else {
            listItem.setAttribute("style", "display: block");
        }
    });
}

function deleteTodo(e) {
    //console.log(e.target);

    if(e.target.className === "fa fa-remove") {
        // console.log("silme işlemi");
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success", "Todo Silindi!");
    //bu şekilde arayüzden silindi.

    }

}

function deleteTodoFromStorage(deletetodo) {
    //silinen todoları localden silme
    let todos = getTodosFromStorage();
    //delete item from array 
    todos.forEach(function(todo, index) {
        if (todo === deletetodo) {
            todos.splice(index,1); //arrayden değeri silme
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos));
}

function loadAllTodosUI() { 
    //sayfaya eklenen todolar yenilendiğinde localStorageden todoları alma
    let todos = getTodosFromStorage();
    todos.forEach(function(todo) {
        addTodoToUI(todo);
    })
}

function addTodo(e) {
    const newTodo = todoInput.value.trim();
    
    if(newTodo === "") {
        // <div class="alert alert-danger" role="alert">
        //          <strong> Todo Ekleyin!</strong>
        //           </div>
        showAlert("danger", "Lütfen Todo girin!");
    }
    else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success", "Todo eklendi")
    }
    
    e.preventDefault();
}
function getTodosFromStorage() { //storagedan bütün todoları alma
    let todos;
    
    if (localStorage.getItem("todos") === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;

}
function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message) {

    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    firstCardBody.appendChild(alert);

    //setTimeout = belli sn içinde kullanma
    setTimeout(function(){
        alert.remove();
    }, 1000);
}

function addTodoToUI(newTodo) { //string değerini list item olarak UI'ye ekler.
    
    // <li class="list-group-item d-flex justify-content-between">
    //                         Todo 1
    //                         <a href = "#" class ="delete-item">
    //                             <i class = "fa fa-remove"></i>
    //                         </a>

    //ListItem Oluşturma
    const listItem = document.createElement("li");
    //Link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";
    
    // Text Node Ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);
    
    //Todo Liste List Item'ı ekleme

    todoList.appendChild(listItem);
    todoInput.value = "";

}