const {nanoid} = require('nanoid');
const books = require('./books');
const tempBook = books;


const addBooksHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBooks = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };


  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage>pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. ' +
          'readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  books.push(newBooks);
  const isSuccess = books.filter((books) => books.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } else {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
};

const getAllBooksHandler = (request, h) => {
  const newBooks = [];
  if (request.query.reading) {
    if (request.query.reading==='0') {
      const temp = tempBook.filter((n) => n.reading === false);
      const books = temp.map((book) => {
        const {id, name, publisher} = book;
        return {id, name, publisher};
      });
      return {
        status: 'success',
        data: {
          books,
        },
      };
    } else if (request.query.reading==='1') {
      const temp = tempBook.filter((n) => n.reading === true);
      const books = temp.map((book) => {
        const {id, name, publisher} = book;
        return {id, name, publisher};
      });
      return {
        status: 'success',
        data: {
          books,
        },
      };
    }
  }
  if (request.query.finished) {
    if (request.query.finished==='0') {
      const temp = tempBook.filter((n) => n.finished === false);
      const books = temp.map((book) => {
        const {id, name, publisher} = book;
        return {id, name, publisher};
      });
      return {
        status: 'success',
        data: {
          books,
        },
      };
    } else if (request.query.finished==='1') {
      const temp = tempBook.filter((n) => n.finished === true);
      const books = temp.map((book) => {
        const {id, name, publisher} = book;
        return {id, name, publisher};
      });
      return {
        status: 'success',
        data: {
          books,
        },
      };
    }
  }
  if (request.query.name) {
    const lowerName = request.query.name.toLowerCase();
    const temp = tempBook.filter((n) =>
      n.name.toLowerCase().includes(lowerName),
    );
    const books = temp.map((book) => {
      const {id, name, publisher} = book;
      return {id, name, publisher};
    });
    return {
      status: 'success',
      data: {
        books,
      },
    };
  }

  for (const book of tempBook) {
    newBooks.push({id: book.id, name: book.name, publisher: book.publisher});
  }
  const books = newBooks;
  return {
    status: 'success',
    data: {
      books,
    },
  };
};

const getBooksByIdHandler = (request, h) => {
  const {id} = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBooksByIdHandler = (request, h) => {
  const {id} = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const finished = (pageCount === readPage);
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. ' +
          'readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  } else if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'error',
      message: 'Gagal memperbarui buku.',
    });
    response.code(404);
    return response;
  }
};

const deleteBooksByIdHandler = (request, h) => {
  const {id} = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
};
