function BookId() {
    this.num = 0;
}

BookId.prototype.next = function() {
    this.num += 1;
    return this.num;
}

const bookId = new BookId();

/* title, author: String,
 * pages: Number,
 * read: boolean */
function Book(title, author, pages, read) {
    this.id = bookId.next();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleRead = function() {
    this.read = !this.read;
}

function Library() {
    this.books = [];
}

Library.prototype.addBook = function(title, author, pages, read) {
    this.books.push(new Book(title, author, pages, read));
}

Library.prototype.removeBook = function(id) {
    const idx = this.books.findIndex((book) => book.id === id);
    if (idx !== -1) this.books.splice(idx);
}

Library.prototype.getBook = function(id) {
    return this.books.find((book) => book.id === id);
}

export const library = new Library();


/* Test */
// const myLibrary = new Library();
// myLibrary.addBook('The Hobbit', 'J.J.R.Tolkein', 500, false);
// myLibrary.addBook('The Little Prince', 'Antoine de Saint-Exupéry', 200, false);
// myLibrary.getBook(1).toggleRead();
// console.log(myLibrary);
// myLibrary.removeBook(2);
// console.log(myLibrary);

