const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks')
const path = require('path');

const app = express();
const prisma = new PrismaClient();

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('view engine', 'html')

app.use(bodyParser.urlencoded({ extended: true }));

// Read - Display all contacts
app.get('/', async (req, res) => {
  const contacts = await prisma.contact.findMany();
  res.render('index', { contacts });
});

// Create - Form to add a new contact
app.get('/add', (req, res) => {
  res.render('add');
});

// Create - Add a new contact
app.post('/add', async (req, res) => {
  const { name, email, phone } = req.body;
  await prisma.contact.create({
    data: {
      name,
      email,
      phone,
    },
  });
  res.redirect('/');
});

// Update - Form to edit a contact
app.get('/edit/:id', async (req, res) => {
  const contact = await prisma.contact.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.render('edit', { contact });
});

// Update - Update a contact
app.post('/edit/:id', async (req, res) => {
  const { name, email, phone } = req.body;
  await prisma.contact.update({
    where: {
      id: parseInt(req.params.id),
    },
    data: {
      name,
      email,
      phone,
    },
  });
  res.redirect('/');
});

// Delete - Delete a contact
app.get('/delete/:id', async (req, res) => {
  await prisma.contact.delete({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});