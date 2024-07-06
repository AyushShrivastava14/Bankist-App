'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Ayush Shrivastava',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Piyush Shrivastava',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Aryan Chauhan',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Harsh Choudhary',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];



// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



const updateUI = acc => {
  // Display Movements
  displayMovements(acc.movements);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};



const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, idx) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${idx + 1} ${type}</div>
      <div class="movements__value">${mov} Rs</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};



const calcDisplayBalance = function(accs) {
  accs.balance = accs.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${accs.balance} Rs`;
};



const calcDisplaySummary = (accs) => {
  const income = accs.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income} Rs`;

  const out = accs.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} Rs`;

  const interest = accs.movements.filter(mov => mov > 0)
  .map(deposit => (deposit * accs.interestRate) / 100).filter(int => int >= 1)
  .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest} Rs`;
}



const createUsernames = function(accs) {
  accs.forEach(acc =>  acc.username = acc.owner
  .toLowerCase().split(' ').map(Name => Name[0]).join(''));
}
createUsernames(accounts);



let currentAccount;

btnLogin.addEventListener('click', function(event) {
  event.preventDefault();
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();
    
    // Display Name
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    
    // Display UI
    containerApp.style.opacity = 100;
    
    // Update UI
    updateUI(currentAccount);
  }
});



let sorted = false;
btnSort.addEventListener('click', function(event) {
  event.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});



btnTransfer.addEventListener('click', function(event) {
    event.preventDefault();

    const amount = Number(inputTransferAmount.value);
    const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    inputTransferTo.blur();

    if(amount > 0 && amount <= currentAccount.balance && recieverAcc && recieverAcc?.username !== currentAccount.username) {

      // Transaction movement
      currentAccount.movements.push(-amount);
      recieverAcc.movements.push(amount);

      // Update UI
      updateUI(currentAccount);
    }
});



btnLoan.addEventListener('click', function(event) {
  event.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    // Updating movements
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});



btnClose.addEventListener('click', function(event) {
  event.preventDefault();

  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    // Finding Index of the element
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    // Deleting account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputCloseUsername.value = '';
  
  // Welcome label change to default
  labelWelcome.textContent = 'Log in to get started';
});