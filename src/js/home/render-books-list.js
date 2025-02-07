import FetchCategoriesAll from './service-categories-all';
import { checkCurrentCategory } from './render-categories-list';
import { openCardModal } from './modal-card';

const loader = document.getElementById('loader-wrapper');

const viewportWidth = window.innerWidth;
let booksPerCategory = 5;

if (viewportWidth < 1440 && viewportWidth >= 768) {
  booksPerCategory = 3;
} else if (viewportWidth < 768) {
  booksPerCategory = 1;
}

const fetchApiCategories = new FetchCategoriesAll();

const booksList = document.querySelector('.books-list');

export const renderBooksList = async () => {
  loader.classList.remove('visually-hidden');
  const categoriesTop = await fetchApiCategories.getCategoriesTop();
  loader.classList.add('visually-hidden');

  booksList.innerHTML = '';
  categoriesTop.forEach(category => {
    const books = category.books
      .slice(0, booksPerCategory)
      .map(book => {
        return `  
        <div class="book-card" data-book-id="${book._id}">
          <div class="book-card-hover">
            <img loading="lazy" src="${book.book_image}" alt="${book.title}" class="book-image">
            <p>quick view</p>
          </div>
          <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-autor">${book.author}</p>
          </div>
        </div>
      `;
      })
      .join('');

    const categorySection = `
    <section class="category-section">
      <h3 class="books-list-title-fo-all-categori">${category.list_name}</h3>
      <div class="books-container">
        ${books}
      </div>
      <button type=button data-category-books="${category.list_name}" class="category-books-button">SEE MORE</button>
    </section>`;

    booksList.insertAdjacentHTML('beforeend', categorySection);
  });

  const mainTitle = `<h2 class="books-list-title">Best Sellers <span class="span-books-list-title">Books</span></h2>`;
  booksList.insertAdjacentHTML('afterbegin', mainTitle);

  booksList.addEventListener('click', async event => {
    const bookCard = event.target.closest('.book-card');
    if (bookCard) {
      const bookId = bookCard.dataset.bookId;
      const selectedBook = await fetchApiCategories.getBookId(bookId);

      openCardModal(selectedBook);
    }
  });

  booksList.addEventListener('click', async event => {
    if (event.target.classList.contains('category-books-button')) {
      const category = event.target.dataset.categoryBooks;
      renderBooksListCategory(category);
      checkCurrentCategory(category);
    }
  });
};

renderBooksList();

export const renderBooksListCategory = async category => {
  loader.classList.remove('visually-hidden');
  const booksListCategory = await fetchApiCategories.getCategoriesSelected(
    category
  );
  loader.classList.add('visually-hidden');

  booksList.innerHTML = '';
  const booksTitle = category.split(' ');
  const booksTitleLast = booksTitle.pop();
  const booksTitleFirst = booksTitle.join(' ');

  const books = booksListCategory
    .map(book => {
      return `
    <div class="book-card book-card-wrapper" data-book-id="${book._id}">
        <img loading="lazy" src="${book.book_image}" alt="${book.title}" class="book-image">
        <div class="book-card-hover"><p>quick view</p></div>
        <div class="book-info">
          <h3 class="book-title">${book.title}</h3>
          <p class="book-autor">${book.author}</p>
        </div>
    </div>
    `;
    })
    .join('');

  const booksSection = `
    <section class="category-section">
      <h2  class="books-list-title">${booksTitleFirst} <span class="span-books-list-title">${booksTitleLast}</span></h2>
      <div class="books-container">
        ${books}
      </div>
    </section>
  `;

  booksList.insertAdjacentHTML('beforeend', booksSection);

  window.scrollTo(0, 0);
};