const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Intentionally weak session config
app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// CSRF protection (intentionally misconfigured)
app.use(csrf({ cookie: false }));

// Dummy user DB
const users = [{ username: 'admin', password: '123', isAdmin: true }];

function isAuthenticated(req) {
  return req.session && req.session.user;
}

app.get('/', (req, res) => {
  res.render('index', { user: req.session.user, csrfToken: req.csrfToken() });
});

app.get('/login', (req, res) => {
  res.render('login', { error: null, csrfToken: req.csrfToken() });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    return res.redirect('/');
  }
  res.render('login', { error: 'Invalid credentials', csrfToken: req.csrfToken() });
});

app.get('/register', (req, res) => {
  res.render('register', { error: null, csrfToken: req.csrfToken() });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  // Weak password policy
  if (!username || password.length < 3) {
    return res.render('register', { error: 'Password too short', csrfToken: req.csrfToken() });
  }
  users.push({ username, password, isAdmin: false });
  res.redirect('/login');
});

app.get('/admin', (req, res) => {
  // No auth check! Anyone can access
  res.render('admin', { user: req.session.user });
});

app.get('/profile', (req, res) => {
  if (!isAuthenticated(req)) return res.redirect('/login');
  res.render('profile', { user: req.session.user });
});

app.post('/comment', (req, res) => {
  // XSS vulnerability: comment is rendered as HTML
  const { comment } = req.body;
  res.render('comment', { comment });
});

app.get('/broken-nav', (req, res) => {
  // Broken navigation: link goes nowhere
  res.render('broken-nav');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// 404
app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(3000, () => {
  console.log('Test site running on http://localhost:3000');
});
