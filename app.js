// Altera a opacidade do menu superior conforme o usuário rola a página para baixo
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    } else {
        header.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    }
});