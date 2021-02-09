let myLibrary = [];

/* const dbRefObject = firebase.database().ref().myLibrary;
dbRefObject.on("value", snap => console.log(snap.val())) */

let database = firebase.database();
let ref = database.ref("books");
ref.on("value", gotData, errData);

function gotData(data) {
    books = data.val();
    console.log(books);
    let keys = Object.keys(data.val());
    console.log(keys);
    for(let i = 0; i < keys.length; i++)
    {
        new Book(books[keys[i]].title, books[keys[i]].author, books[keys[i]].year).displayBook();
        
        console.log(books[keys[i]]);
    }
    
}

function errData(err) {
    console.log("error");
    console.log(err.val());
}

class Book {
    constructor(title, author, year) {
        this.title = title;
        this.author = author;
        this.year = year;
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
        readButton.setAttribute("data-id", this.library.indexOf(this))
        readButton.addEventListener("click", setBookReadButton);
        bookReadCell.appendChild(readButton);

        tableRow.appendChild(bookReadCell);

        let deleteButtonCell = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButton.setAttribute("data-id", this.library.indexOf(this));
        deleteButtonCell.appendChild(deleteButton);
        deleteButton.textContent = "Delete book";
        deleteButton.addEventListener("click", deleteBookEvent);
        tableRow.appendChild(deleteButtonCell);

        booksData.appendChild(tableRow);
        return this;
    }

    addBookToLibrary() {
        this.library.push(this);
        ref.push(this);
        return this;
    }

    static displayAllBooks() {
        Book.prototype.library.forEach(book => book.displayBook());
    }

    static createNewBookForm() {
        let _title = document.querySelector("#bookTitleInput");
        let _author = document.querySelector("#bookAuthorInput");
        let _year = document.querySelector("#bookYearInput");
        new Book(_title.value, _author.value, _year.value).addBookToLibrary().displayBook();
        _title.value = "";
        _author.value = "";
        _year.value = "";

        
    }

}
//sets the library the class works with
Book.prototype.library = myLibrary;

function deleteBookEvent(elem) {
    myLibrary.splice(elem.target.getAttribute("data-id"), 1);
    let allBookRows = document.querySelectorAll(".singleBook");
    console.log(allBookRows);
    for(let i = 0; i < allBookRows.length; i++) {
        allBookRows[i].parentNode.removeChild(allBookRows[i]);
    }
    Book.displayAllBooks();
}

function setBookReadButton(elem) {
    let index = elem.target.getAttribute("data-id")
    myLibrary[index].changeBookReadState();
    elem.target.parentNode.firstChild.textContent = myLibrary[index].read;
}


/* new Book("The Hobbit", "J. R. R. Tolkien", 1937).addBookToLibrary().displayBook();
new Book("Hitchhiker's guide to the galaxy", "Douglas Adams", 1978).addBookToLibrary().displayBook();
new Book("Atomic Habits", "James Clear", 2018).addBookToLibrary().displayBook();
 */



const addBookButton = document.querySelector("#submitNewBook");
addBookButton.addEventListener("click", Book.createNewBookForm);
