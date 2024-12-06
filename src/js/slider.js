import { images } from '/src/js/consts'

const sliderWrapper = document.querySelector('.slider');
const sliderImages = sliderWrapper.querySelector(".slider__images")
let sliderPoints;

let num = 0;

//---------------------Отображение слайдов-------------------

function initImages() {
    images.forEach((image, index) => {
        let imageElement = document.createElement('div');
        imageElement.classList = `image n${index} ${index ? "" : "active"}`;
        imageElement.dataset.index = index;
        imageElement.style.backgroundImage = `url(${image.url})`;
        sliderImages.appendChild(imageElement);
    })
}

//---------------------Переключение слайдов--------------------

function moveSlider(num) {
    sliderImages.querySelector('.active').classList.remove('active');
    sliderImages.querySelector(`.n${num}`).classList.add('active');

    sliderPoints.querySelector('.active').classList.remove('active');
    sliderPoints.querySelector(`.n${num}`).classList.add('active');
}

//--------------------Отображение точек управления слайдами--------------------

function initPoints() {
    let pointsWrapper = document.createElement('div');
    pointsWrapper.classList = 'slider__points';
    images.forEach((image, index) => {
        let point = document.createElement('div');
        point.classList = `slider__points-item n${index} ${index ? "" : "active"}`;
        point.dataset.index = index;
        point.addEventListener('click', () => {
            num = index;
            moveSlider(num);
        });
        pointsWrapper.appendChild(point);
    });
    sliderWrapper.appendChild(pointsWrapper);
    sliderPoints = sliderWrapper.querySelector(".slider__points");
};

//--------------------Автоматическое переключение слайдов----------------

function sliderAuto() {
    setInterval(() => {
        let currentNumber = +sliderImages.querySelector('.active').dataset.index;
        let nextNumber = currentNumber === images.length - 1 ? 0 : currentNumber + 1;
        moveSlider(nextNumber);
    }, 5000)
}


export { initImages, moveSlider, initPoints, sliderAuto, sliderWrapper, sliderImages, num }