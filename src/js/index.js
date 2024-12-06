import { booksRequest, params } from '/src/js/requests.js';
import { initImages, initPoints, sliderAuto } from '/src/js/slider.js';
import { categories } from '/src/js/consts.js';
import "/src/css/style.css";

let fullArrayOfBooks = [];
const LoadMoreButton = document.querySelector('.btn');
const cartCountElement = document.getElementById("cart-count");
cartCountElement.textContent = +localStorage.length;

initImages(); //---------------------Отображение слайдов-------------------

initPoints(); //--------------------Отображение точек управления слайдами--------------------

sliderAuto(); //--------------------Автоматическое переключение слайдов----------------

//------------------Отображение категорий книг---------------------

const categoriesWrapper = document.querySelector(".categories")

initCategories();

function initCategories() {
    categories.forEach((category, index) => {
        let categoryElement = document.createElement('div');
        categoryElement.classList = `category n${index} ${index ? "" : "active"}`;
        categoryElement.innerHTML += `<a href="#" onclick="return false">${category.categoriesName}</a>`
        categoryElement.dataset.index = index;
        categoryElement.addEventListener('click', () => {
            params.set("startIndex", "0")
            selectedCategory(index);
            chooseSub(index);

        })
        categoriesWrapper.appendChild(categoryElement);
    })
}

//--------------Активная категория-------------------

function selectedCategory(index) {
    categoriesWrapper.querySelector('.active').classList.remove('active');
    categoriesWrapper.querySelector(`.n${index}`).classList.add('active');
}

//---------------------выборка в мап нужных свойств товара-----------------

function mapOfData() {
    booksRequest()
        .then(data => {
            let mappedData = [];
            if (data) {
                console.log(data)
                mappedData = data.items.map(item => ({
                    authors: item.volumeInfo.authors?.map(author => ({
                        author: author
                    })),
                    title: item.volumeInfo.title,
                    averageRating: item.volumeInfo.averageRating,
                    ratingsCount: item.volumeInfo.ratingsCount,
                    description: item.volumeInfo.description,
                    listPrice: item.saleInfo.listPrice?.amount,
                    imageLink: item.volumeInfo.imageLinks?.thumbnail,
                    id: item.id,
                }));
                console.log(mappedData);
                renderData(mappedData)

            }
            fullArrayOfBooks = [...fullArrayOfBooks, ...mappedData];
            chekBookInStorage();

        });
}

mapOfData();

//-----------------Отображение карточек с книгами----------------

let imagePlaceHolder = "img/placeHolder.png"
const container = document.querySelector(".bookList");
let startIndex = 0;

function renderData(data) {
    if (+params.get("startIndex") === 0) {
        container.innerHTML = ''; // Очистка контейнера, если выбрана другая категория
    }
    data.forEach((item, index) => {
        let dataWithoutUndefined = [];
        dataWithoutUndefined = Object.entries(item)
        const itemElement = document.createElement('div');
        itemElement.classList = "book-item";
        itemElement.dataset.id = item.id;
        let thumbnail = document.createElement('div')
        thumbnail.classList = "thumbnail-item";
        thumbnail.innerHTML = `<img class="thumbnailImg" src="${item.imageLink === undefined ? imagePlaceHolder : item.imageLink}">`;
        itemElement.appendChild(thumbnail);
        let bookInfo = document.createElement('div');
        bookInfo.classList = "bookInfo";
        bookInfo.dataset.index = startIndex + index;
        let authorsList = [];
        item.authors?.forEach(item => { authorsList += `${item.author},` })
        dataWithoutUndefined.forEach(item => {
            if (item[1] === undefined) {
                item[1] = '';
            }
            let bookInfoItem = document.createElement('div');
            bookInfoItem.classList = `${item[0]}`;
            bookInfo.appendChild(bookInfoItem);
        })

        let pug =
            `<div class="rating">
            <div class="rating__body">
                <div class="rating__active">
                    <div class="rating__items">
                        <input type="radio" class="rating__item" value="1" name="rating">
                            <input type="radio" class="rating__item" value="2" name="rating">
                                <input type="radio" class="rating__item" value="3" name="rating">
                                    <input type="radio" class="rating__item" value="4" name="rating">
                                        <input type="radio" class="rating__item" value="5" name="rating">
                                        </div>
                                    </div>
                                </div>
                            </div>`

        bookInfo.querySelector('.authors').innerHTML = `<span>${authorsList}</span>`
        bookInfo.querySelector('.title').innerHTML = `<h4>${(dataWithoutUndefined[1])[1]}</h4>`
        bookInfo.querySelector('.averageRating').innerHTML = pug;
        bookInfo.querySelector('.ratingsCount').innerHTML = `<span>${(dataWithoutUndefined[3])[1]} review </span>`
        bookInfo.querySelector('.description').innerHTML = `<p>${(dataWithoutUndefined[4])[1]}</p>`
        bookInfo.querySelector('.listPrice').innerHTML = `<h4>${(dataWithoutUndefined[5])[1].toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h4>`
        bookInfo.querySelector(`.rating__active`).style.width = `${(dataWithoutUndefined[2])[1] / 0.05}%`
        if ((dataWithoutUndefined[2])[1] === '') {
            bookInfo.querySelector(`.averageRating`).style.display = `none`;
        }
        if ((dataWithoutUndefined[3])[1] === '') {
            bookInfo.querySelector(`.ratingsCount`).style.display = `none`;
        }
        bookInfo.innerHTML += `<button class="add-btn n${bookInfo.dataset.index}">BUY NOW</button>`;
        itemElement.appendChild(bookInfo);
        container.appendChild(itemElement);
    });
}

//----------------Добавление книги в корзину и в localStorage-------------------

function addCart(event) {
    if (event.target && event.target.classList.contains('add-btn')) {
        if (event.target.innerHTML === 'BUY NOW') {
            event.target.textContent = 'IN THE CART';
            localStorage.setItem(`${event.target.parentElement.parentElement.dataset.id}`, `${JSON.stringify(fullArrayOfBooks[event.target.parentElement.dataset.index])}`)
            cartCountElement.textContent = +localStorage.length;
            event.target.classList.add('inTheCart')
        }
        else {
            event.target.textContent = 'BUY NOW';
            localStorage.removeItem(`${event.target.parentElement.parentElement.dataset.id}`)
            cartCountElement.textContent = +localStorage.length;
            event.target.classList.remove('inTheCart')
        }
    }
}

container.addEventListener('click', addCart);

//----------------Выбор категории-----------------

function chooseSub(index) {
    startIndex = 0;
    fullArrayOfBooks = [];
    params.set('q', `"subject:${categories[index].categoriesName}"`)
    mapOfData();
}

//----------------Реализация ленивой подгрузки-----------------

LoadMoreButton.addEventListener('click', () => {
    startIndex += 6;
    params.set("startIndex", `${+params.get("startIndex") + 6}`)
    console.log(params.get('startIndex'))
    mapOfData()
})

//----------------Проверка наличия книги в localStorage-------------

function chekBookInStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        console.log(key);
        fullArrayOfBooks.forEach((item, index) => {
            if (item.id === key) {
                const p = document.querySelector(`.add-btn.n${index}`)
                p.textContent = 'IN THE CART'
                p.classList.add('inTheCart')
            }
        })
    }
}