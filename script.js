'use strict';

// BANKIST APP

// Data
// const account1 = {
//   owner: 'Ayush Shrivastava',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };

// const account2 = {
//   owner: 'Piyush Shrivastava',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };

// const account3 = {
//   owner: 'Aryan Chauhan',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Harsh Choudhary',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];


// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Ayush Shrivastava",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-06-02T17:01:17.194Z",
    "2024-07-03T23:36:17.929Z",
    "2024-07-05T10:51:36.790Z",
  ],
  currency: "INR",
  locale: "hi-IN",
};

const account2 = {
  owner: "Piyush Shrivastava",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "INR",
  locale: "hi-IN",
};

const accounts = [account1, account2];



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



let currentAccount;

const updateUI = acc => {
  // Display Movements
  displayMovements(acc);
  
  // Display Balance
  calcDisplayBalance(acc);
  
  // Display Summary
  calcDisplaySummary(acc);
};



const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();

  // return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);
}



const formatCur = function(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};



const displayMovements = function(accs, sort = false) {
  containerMovements.innerHTML = '';
  
  const movs = sort ? accs.movements.slice().sort((a, b) => a - b) : accs.movements;
  
  movs.forEach((mov, idx) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(accs.movementsDates[idx]);
    
    const displayDate = formatMovementDate(date, accs.locale);
    
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatCur(mov, accs.locale, accs.currency)}</div>
    </div>`;
    
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};



const calcDisplayBalance = function(accs) {
  accs.balance = accs.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(accs.balance, accs.locale, accs.currency)}`;
};



const calcDisplaySummary = (accs) => {
  const income = accs.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCur(income, accs.locale, accs.currency)}`;
  
  const out = accs.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${formatCur(Math.abs(out), accs.locale, accs.currency)}`;
  
  const interest = accs.movements.filter(mov => mov > 0)
  .map(deposit => (deposit * accs.interestRate) / 100).filter(int => int >= 1)
  .reduce((acc, int) => acc + int, 0);
  
  labelSumInterest.textContent = `${formatCur(interest, accs.locale, accs.currency)}`;
}



const createUsernames = function(accs) {
  accs.forEach(acc =>  acc.username = acc.owner
    .toLowerCase().split(' ').map(Name => Name[0]).join(''));
  }
  createUsernames(accounts);
  
  
  
  
btnLogin.addEventListener('click', function(event) {
  event.preventDefault();
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  
  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();
    
    // Display Name
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

    // Display Date
    const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    
    // Display UI
    containerApp.style.opacity = 100;
    
    // Update UI
    updateUI(currentAccount);
  }
});
  
  
  
let sorted = false;
btnSort.addEventListener('click', function(event) {
  event.preventDefault();
  
  displayMovements(currentAccount, !sorted);
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

      currentAccount.movementsDates.push(new Date());
      recieverAcc.movementsDates.push(new Date());
      
      // Update UI
      updateUI(currentAccount);
    }
});
  
  
  
btnLoan.addEventListener('click', function(event) {
    event.preventDefault();
    
    const amount = Math.floor(inputLoanAmount.value);
    
    if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
      
      setTimeout(() => {// Updating movements
        currentAccount.movements.push(amount);

        // Updating MovementsDates
        currentAccount.movementsDates.push(new Date());
        
        // Update UI
        updateUI(currentAccount);
      }, 3000);
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



// Fake login (delete it after use)
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


