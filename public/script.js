const phoneCard = document.querySelector('.phone-card');
const callNum = document.querySelector('.call-num');

phoneCard.addEventListener('click', () => {
  callNum.click();
});