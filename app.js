const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('main', { layout: false });
});

app.post('/send', (req, res) => {
  const output = `
  <p>You have a new quote request</p>
  <h3>Request Details</h3>
  <ul>
  <li>Name: ${req.body.firstName} ${req.body.lastName}</li>
  <li>Pickup Zip Code: ${req.body.originZip}</li>
  <li>Drop-Off Zip Code: ${req.body.destinationZip}</li>
  <li>Email: ${req.body.email}</li>
  <li>Phone Number: ${req.body.phoneNumber}</li>
  <li>Requested Pickup Date: ${req.body.moveDate}</li>
  <li>Move Size: ${req.body.bedrooms}</li>
  </ul>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'moverquoter@gmail.com', // generated ethereal user
      pass: 'tgTVGZpJwS4Bn9jM', // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: '"Off-Load Movers Landing Page" <moverquoter@gmail.com>', // sender address
    to: "foyerjustin26@gmail.com", // list of receivers
    subject: "*New* Off-Load Movers Lead", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  
  res.redirect('success', {
    layout: false,
  });
});

app.listen(3000, () => console.log('Server started on port 3000...'));
