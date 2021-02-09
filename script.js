let myLibrary = [
    new Book("The Hobbit", "J. R. R. Tolkien", 1937),
    new Book("Hitchhiker's guide to the galaxy", "Douglas Adams", 1978),
    new Book("Atomic Habits", "James Clear", 2018)
];

function Book(title, author, year) {
    this.title = title;
    this.author = author;
    this.year = year;
    return this;
}

Book.prototype.displayBook = function() {
    let booksData = document.querySelector("table");
        let tableRow = document.createElement("tr");
        
        let titleCell = document.createElement("td");
        titleCell.textContent = this.title;
        tableRow.appendChild(titleCell);

        let authorCell = document.createElement("td");
        authorCell.textContent = this.author;
        tableRow.appendChild(authorCell);

        let yearCell = document.createElement("td");
        yearCell.textContent = this.year;
        tableRow.appendChild(yearCell);

        let deleteButtonCell = document.createElement("td");
        let deleteButton = document.createElement("button");
        deleteButtonCell.appendChild(deleteButton);
        deleteButton.textContent = "Delete book";
        deleteButton.addEventListener("click", deleteBook)
        tableRow.appendChild(deleteButtonCell);

        booksData.appendChild(tableRow);
        return this;
}

Book.prototype.addBookToLibrary = function () {
    myLibrary.push(this);
}

function createNewBook() {
    let _title = document.querySelector("#bookTitleInput").value;
    let _author = document.querySelector("#bookAuthorInput").value;
    let _year = document.querySelector("#bookYearInput").value;
    new Book(_title, _author, _year).displayBook().addBookToLibrary();
}

function displayLibrary(library) {
    library.forEach(book => book.displayBook()); 
}

function deleteBook(book) {

}


displayLibrary(myLibrary);

let neki = new Book(" 213", "21312", 111).displayBook().addBookToLibrary();

const addBookButton = document.querySelector("#submitNewBook");
addBookButton.addEventListener("click", createNewBook);