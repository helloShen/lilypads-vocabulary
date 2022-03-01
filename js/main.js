import { library  } from "./library.js";

const addBookBtn = document.querySelector('.addBook');
const form = document.querySelector('.addBookForm');
addBookBtn.addEventListener('click', () => {
    form.style.display = 'block';
});

const main = document.querySelector('div.main');
function addBookToLibrary(e) {
    e.preventDefault();
    const title = form.querySelector('input[id="title"]').value;
    const author = form.querySelector('input[id="author"]').value;
    const pages = form.querySelector('input[id="pages"]').value;
    const read = form.querySelector('input[id="read"]').checked;
    library.addBook(title, author, pages, read);
    displayLibrary();
    form.reset();
    form.style.display = 'none';
}

const submitAddBookFormBtn = document.querySelector('.submitAddBookForm');
submitAddBookFormBtn.addEventListener('click', (e) => addBookToLibrary(e));

function insertCard(book) {
    const card = document.createElement('div');
    const title = document.createElement('div');
    const author = document.createElement('div');
    const pages = document.createElement('div');
    const read = document.createElement('div');
    
    card.classList.add('card');
    card.dataset['id'] = book.id;
    title.classList.add('title');
    author.classList.add('author');
    pages.classList.add('pages');
    read.classList.add('read');
    title.innerHTML = book.title;
    author.innerHTML = book.author;
    pages.innerHTML = book.pages;
    read.innerHTML = book.read;
    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(pages);
    card.appendChild(read);
    main.appendChild(card);
}

const addBook = document.querySelector('.card.addBook');
function displayLibrary() {
    clearCards();
    library.books.forEach((book) => insertCard(book));
    main.appendChild(addBook);
}

function clearCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card) => card.remove());
}

