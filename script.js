const opponents = document.querySelectorAll('span');
const menu = document.querySelector('.menu');

let opponent;
opponents.forEach((opponent) => opponent.addEventListener("click", function() {
    menu.classList.add('deactivate');
    (this.classList.value.includes('player')) ? opponent = 'player' : opponent = 'computer';
    console.log(opponent);

}))