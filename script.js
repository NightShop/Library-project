let localLib = [];

/* const dbRefObject = firebase.database().ref().myLibrary;
dbRefObject.on("value", snap => console.log(snap.val())) */

let database = firebase.database();
let ref = database.ref("books");
ref.on("value", gotData, errData);

function clearEveryThing() {
    localLib = [];
    let allBooks = document.querySelectorAll(".singleBook");
    for(let i = 0; i < allBooks.length; i++) {
        allBooks[i].remove();
    }
}

function gotData(data) {
    clearEveryThing();
    books = data.val();
    console.log(books);
    let keys = Object.keys(data.val());
    console.log(keys);
    for(let i = 0; i < keys.length; i++)
    {
        let temp = new Book(books[keys[i]].title, books[keys[i]].author, books[keys[i]].year, keys[i]);
        temp.read = books[keys[i]].read;
        temp.displayBook();
        localLib.push(temp);
        console.log(books[keys[i]]);
    }
    
}

function errData(err) {
    console.log("error");
    console.log(err.val());
}

class Book {
    constructor(title, author, year, id) {
        this.title = title;
        this.author = author;
        this.year = year;
        this.id = id;
        this.read = false;
        return this;
    }

    deleteBook() {
        this.library.splice(this.library.indexOf(this), 1);
    }

    changeBookReadState() {
        this.read = !this.read;
    }

    displayBook() {
        let booksData = document.querySelector("table");
        let tableRow = document.createElement("tr");
        tableRow.classList.add("singleBook");

        let titleCell = document.createElement("td");
        titleCell.textContent = this.title;
        tableRow.appendChild(titleCell);

        let authorCell = document.createElement("td");
        authorCell.textContent = this.author;
        tableRow.appendChild(authorCell);

        let yearCell = document.createElement("td");
        yearCell.textContent = this.year;
        tableRow.appendChild(yearCell);

        let bookReadCell = document.createElement("td");
        let bookReadCellPara = document.createElement("p");
        bookReadCellPara.textContent = this.read.toString();

        bookReadCell.appendChild(bookReadCellPara);

        let readButton = document.createElement("button");
        readButton.setAttribute("data-id", this.id);
        readButton.addEventListener("click", setBookReadButton);
        bookReadCell.appendChild(readButton);

        tableRow.appendChild(bookReadCell);

        let deleteButtonCell = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("data-id", this.id);
        deleteButtonCell.appendChild(deleteButton);
        deleteButton.textContent = "Delete book";
        deleteButton.addEventListener("click", deleteBookEvent);
        tableRow.appendChild(deleteButtonCell);

        booksData.appendChild(tableRow);
        return this;
    }

    addBookToFireBase() {
        let newBookRef = ref.push();
        console.log(newBookRef.key);
        this.id = newBookRef.key;
        newBookRef.set(this);
        return this;
    }

    static displayAllBooks() {
        Book.prototype.library.forEach(book => book.displayBook());
    }

    static createNewBookForm() {
        let _title = document.querySelector("#bookTitleInput");
        let _author = document.querySelector("#bookAuthorInput");
        let _year = document.querySelector("#bookYearInput");
        new Book(_title.value, _author.value, _year.value, "test").addBookToFireBase();
        _title.value = "";
        _author.value = "";
        _year.value = "";

        
    }

}

function deleteBookEvent(elem) {
    let id = elem.target.getAttribute("data-id");

    let obj = {};
    obj[id] = null;
    ref.update(obj);

}

function setBookReadButton(elem) {
    let id = elem.target.getAttribute("data-id");
    let bookToChange = localLib.find(book => book.id == id)
    bookToChange.read = !bookToChange.read;
    console.log(bookToChange);
    let obj = {};
    obj[id] = bookToChange;
    ref.update(obj);

    let para = document.querySelector(`[data-id=${CSS.escape(id)}]`).parentElement.firstChild;
    console.log(document.querySelector(`[data-id=${CSS.escape(id)}]`));
    para.textContent = bookToChange.read.toString();

}


/* new Book("The Hobbit", "J. R. R. Tolkien", 1937).displayBook().addBookToFireBase();
new Book("Hitchhiker's guide to the galaxy", "Douglas Adams", 1978).displayBook().addBookToFireBase();
new Book("Atomic Habits", "James Clear", 2018).displayBook().addBookToFireBase();

 */


const addBookButton = document.querySelector("#submitNewBook");
addBookButton.addEventListener("click", Book.createNewBookForm);
