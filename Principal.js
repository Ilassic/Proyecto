//Para controlar el carrusel
let slideIndex = 1;
showSlides(slideIndex);

// Botones de siguiente y anterior
document.querySelector('.carrusel-next').addEventListener('click', function() {
    showSlides(slideIndex += 1);
});

document.querySelector('.carrusel-prev').addEventListener('click', function() {
    showSlides(slideIndex -= 1);
});

//Para los puntos indicadores
function currentSlide(n) {
    showSlides(slideIndex = n);
}

//Para mostrar las diapositivas
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }
    
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    
    slides[slideIndex-1].classList.add("active");
    dots[slideIndex-1].classList.add("active");
}

setInterval(function() {
    showSlides(slideIndex += 1);
}, 3000); 