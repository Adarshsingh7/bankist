'use strict';
let activeAccount;
const rupees = '₹';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Adarsh singh',
  movements: [9549, 18989, 11672, -6662, -3081, 24337, 40810, -6158, 37393, -3602, 1964332, 34350, 41586, 28572, 19987, 48392, 35474, 37722, -1169, 43300, -6911],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Shraddha',
  movements: [3446, 29576, 36632, -7259, 12602, 9575, 23286, 30557, 8167, 45939, 23706, 43994, 10207, 43758, 18927, 38891, 8128, 36208, -6078, 25555],
  interestRate: 1.5,
  balance: 100000,
  pin: 2222,
};

const account3 = {
  owner: 'saumya',
  movements: [39087, 3695, -1561, -7460, 23448, 48142, 28502, 33974, 3590, 12450, 21464, 36444, -3567, 49826, 25484, 45375, 9669, -1832, -697, 10894],
  interestRate: 0.7,
  balance: 100000,
  pin: 3333,
};

const account4 = {
  owner: 'shivani',
  movements: [-1704, 45144, -2305, -2756, 37747, 6368, 14729, 49740, 16077, -4521, 11629, 15266, 33596, 41763, 10760, -9506, 28391, 21466, 22287, -7715],
  interestRate: 1,
  balance: 100000,
  pin: 4444,
};

const account5 = {
  owner: 'sandeep kumar maurya',
  movements: [8314, 24632, 28845, 6901, 36158, -1060, 11008, 38425, -5691, 48769, 1226, 35803, 10471, 38516, 46339, -2703, 14034, 1952, 21223, 43917],
  interestRate: 1,
  balance: 100000,
  pin: 5555,
};

const account6 = {
  owner: 'shobhit yadav',
  movements: [-6385, 29391, 49150, 26059, -934, 16216, 33277, 2239, 49656, 12301, 17312, 12424, 26451, 14846, 4324, 3209, 12613, 34548, 19402, 8741],
  interestRate: 1,
  balance: 100000,
  pin: 6666,
};

const account7 = {
  owner: 'ashutosh shukla',
  movements: [-1195, 11188, 24992, 36048, 15625, -8172, 31289, 40320, 33444, 33103, 8689, 9907, 43935, 39276, 49500, 22743, 29182, 35363, 21650, -1858],
  interestRate: 1,
  balance: 100000,
  pin: 7777,
};

const account8 = {
  owner: 'mayank saini',
  movements: [34039, 39341, 5942, -1683, 26722, 19957, -4507, -9193, 17175, 36849, 18678, 7379, 47385, 16419, 15240, 10379, -8097, 24530, 13296, 28107],
  interestRate: 1,
  balance: 100000,
  pin: 8888,
};


const accounts = [account1, account2, account3, account4, account5, account6, account7, account8];

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

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// before initialization

accounts.forEach(account => {
  account.username = account.owner.split(' ')[0].toLocaleLowerCase();
});

const formatMoney = (amt) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amt);

const formatDate = (date) => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric', weekday: 'long' }).format(date);

const displayCalcBalance = function (acc) {
  const totalBalance = acc.movements.reduce((acc, el) => acc + el);
  labelBalance.innerHTML = `${formatMoney(totalBalance)}`;
};

const displayMovements = function (acc) {
  containerMovements.innerHTML = '';
  acc.movements.forEach((amt, i) => {
    containerMovements.insertAdjacentHTML('afterbegin',
      ` <div class="movements__row" >
          <div class="movements__type movements__type--${amt > 0 ? 'deposit' : 'withdrawal'}">${i + 1} deposit</div>
          <div class="movements__date">${15 - i > 0 ? (`${17 - i} days ago`) : 'today'}</div>
          <div class="movements__value">${formatMoney(amt)}  </div>
        </div>`
    );
  });
};

const displaySummary = function (acc) {
  const sumIn = `${acc.movements
    .filter(el => el > 0)
    .reduce((acc, el) => acc + el)}`;
  const sumOut = `${acc.movements
    .filter(el => el < 0)
    .reduce((acc, el) => acc + el) * -1}`;
  const sumIntrest = `${acc.movements
    .filter(el => el > 0)
    .map(el => el * activeAccount.interestRate / 100)
    .filter(el => el > 1)
    .reduce((acc, el) => acc + el)}`;

  labelSumOut.textContent = formatMoney(sumOut);
  labelSumIn.textContent = formatMoney(sumIn);
  labelSumInterest.textContent = formatMoney(sumIntrest);
};

const updateUI = function (acc) {
  displayCalcBalance(acc);
  displayMovements(acc);
  displaySummary(acc);
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const inputUserName = inputLoginUsername.value;
  const inputPin = +inputLoginPin.value;
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  inputLoginPin.blur();

  // checking credentials and display ui
  activeAccount = accounts.filter(account => account.username === inputUserName)[0];
  if (activeAccount && activeAccount.pin === inputPin) {
    labelDate.textContent = formatDate(new Date());
    containerApp.style.opacity = '1';
    labelWelcome.innerHTML = `Welcome ${activeAccount.owner.split(' ')[0]}`;
    updateUI(activeAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferTo = accounts.filter(acc => acc.username === inputTransferTo.value)[0];
  const amount = +inputTransferAmount.value;
  inputTransferAmount.blur();
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  const totalBalance = activeAccount.movements.reduce((acc, el) => acc + el);

  if (amount > 0 && transferTo != activeAccount && transferTo && (totalBalance - amount) > 0) {
    transferTo.movements.push(amount);
    activeAccount.movements.push(-amount);
    updateUI(activeAccount);
  }

});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = +inputLoanAmount.value;
  if (activeAccount.movements.filter(el => loanAmount * 0.1 < el && loanAmount > 0)[0]) {
    activeAccount.movements.push(loanAmount);
    updateUI(activeAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (activeAccount.username === inputCloseUsername.value && activeAccount.pin === +inputClosePin.value) {

    const index = accounts.findIndex(
      acc => acc.username === activeAccount.username,
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// fake login for the testing purpose
containerApp.style.opacity = 1;
activeAccount = account1;
updateUI(account1);
