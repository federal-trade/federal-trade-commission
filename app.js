const data = JSON.parse(document.getElementById('site-data').textContent);
const publicView = document.getElementById('publicView');
const dashboardView = document.getElementById('dashboardView');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const openLoginBtn = document.getElementById('openLoginBtn');
const closeLoginBtn = document.getElementById('closeLoginBtn');
const toggleBalanceBtn = document.getElementById('toggleBalance');
let isLoggedIn = false;
let currentUser = null;

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);

const applyPublicContent = () => {
  const { site } = data;

  document.getElementById('heroTitle').textContent = site.heroTitle;
  document.getElementById('heroText').textContent = site.heroText;

  const cardsRoot = document.getElementById('infoCards');
  cardsRoot.innerHTML = site.cards
    .map(
      (card) => `
        <article class="info-card">
          <img src="${card.image}" alt="${card.title}" />
          <div class="info-copy">
            <h3>${card.title}</h3>
            <p>${card.copy}</p>
          </div>
        </article>
      `
    )
    .join('');

  const pressRoot = document.getElementById('pressReleases');
  pressRoot.innerHTML = site.pressReleases
    .map(
      (item) => `
        <article class="news-item">
          <h3>${item.title}</h3>
          <div class="date">${item.date}</div>
          <a class="button-link" href="#">${item.button}</a>
        </article>
      `
    )
    .join('');

  const blogRoot = document.getElementById('businessBlog');
  blogRoot.innerHTML = site.businessBlog
    .map(
      (item) => `
        <article class="blog-item">
          <div class="tag">${item.tag}</div>
          <h3>${item.title}</h3>
          <div class="date">${item.date}</div>
          ${item.summary ? `<p class="summary">${item.summary}</p>` : ''}
        </article>
      `
    )
    .join('');

  const meetingsRoot = document.getElementById('openMeetings');
  meetingsRoot.innerHTML = site.openMeetings
    .map(
      (item) => `
        <article class="meeting-item">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
          <a class="button-link" href="#">${item.button}</a>
        </article>
      `
    )
    .join('') + `
      <div class="video-card">
        <div class="play-button">▶</div>
      </div>
    `;
};

const renderDashboard = (account = currentUser) => {
  if (!account) return;

  const initials = account.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  document.querySelector('.avatar').textContent = initials;
  document.getElementById('accountName').textContent = account.name;
  document.getElementById('accountNumber').textContent = account.accountNumber;
  document.getElementById('balanceValue').textContent = formatCurrency(account.balance);
  document.getElementById('incomingAmount').textContent = formatCurrency(account.incoming);
  document.getElementById('outgoingAmount').textContent = formatCurrency(account.outgoing);

  const list = document.getElementById('transactionList');
  list.innerHTML = account.transactions
    .map(
      (item) => `
        <div class="transaction-item">
          <div class="date">${item.date}</div>
          <div>
            <div class="title">${item.title}</div>
            <div class="meta">${item.status}</div>
          </div>
          <div class="amount ${item.type === 'credit' ? 'credit' : 'debit'}">${item.type === 'credit' ? '+' : '-'}${formatCurrency(Math.abs(item.amount))}</div>
        </div>
      `
    )
    .join('');
};

const updateAuthButton = () => {
  openLoginBtn.textContent = isLoggedIn ? 'Logout' : 'Login';
};

const showDashboard = () => {
  publicView.classList.add('hidden');
  dashboardView.classList.remove('hidden');
  loginModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
};

const showPublicView = () => {
  publicView.classList.remove('hidden');
  dashboardView.classList.add('hidden');
  loginModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
};

const logoutUser = () => {
  isLoggedIn = false;
  currentUser = null;
  updateAuthButton();
  showPublicView();
};

const openLogin = () => {
  if (isLoggedIn) {
    logoutUser();
    return;
  }

  loginModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  loginError.classList.add('hidden');
  document.getElementById('userIdInput').focus();
};

const closeLogin = () => {
  loginModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
};

const attemptLogin = (event) => {
  event.preventDefault();

  const userId = document.getElementById('userIdInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();

  const matchingUser = data.accounts.find(
    (account) => account.userId === userId && account.password === password
  );

  if (matchingUser) {
    currentUser = matchingUser;
    isLoggedIn = true;
    updateAuthButton();
    renderDashboard(matchingUser);
    showDashboard();
    loginForm.reset();
    return;
  }

  loginError.classList.remove('hidden');
};

let balanceVisible = true;
const toggleBalance = () => {
  const balanceText = document.getElementById('balanceValue');
  balanceVisible = !balanceVisible;
  balanceText.textContent = balanceVisible && currentUser
    ? formatCurrency(currentUser.balance)
    : '••••••';
  toggleBalanceBtn.textContent = balanceVisible ? '👁' : '🙈';
};

openLoginBtn.addEventListener('click', openLogin);
closeLoginBtn.addEventListener('click', closeLogin);
loginForm.addEventListener('submit', attemptLogin);
toggleBalanceBtn.addEventListener('click', toggleBalance);

applyPublicContent();
updateAuthButton();
showPublicView();
