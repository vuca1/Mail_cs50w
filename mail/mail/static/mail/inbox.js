document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // send email
  document.querySelector('#compose-form').onsubmit = function(event) {
    event.preventDefault();
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    send_email(recipients, subject, body);
  };

  // By default, load the inbox
  load_mailbox('inbox');
});

function send_email(recipients, subject, body) {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    // Print result
    console.log(result);

    // redirect to sent mailbox
  load_mailbox('sent');
  });
}

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function view_email(id) {
  
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // show emails in mailbox
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      // Print emails
      console.log(emails);

      // sort emails
      emails.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      // container for emails
      const container = document.createElement('div');
      document.querySelector('#emails-view').appendChild(container);

      // header
      const header = document.createElement('div');
      header.className = 'd-flex justify-content-between align-items-center border p-2 mb-1';
      header.innerHTML = '<div><strong>Sender</strong></div><div><strong>Subject</strong></div><div><strong>Date</strong></div>';
      container.appendChild(header);

      // display emails
      emails.forEach(email => {
        const row = document.createElement('div');

        // bootstrap
        row.className = 'd-flex justify-content-between align-items-center border p-2 mb-1';

        // form a row
        row.innerHTML = `
        <div>${email.sender}</div>
        <div>${email.subject}</div>
        <div class="text-muted">${email.timestamp}</div>
        `

        // clickable
        row.style.cursor = 'pointer';
        row.onclick = function() {
          view_email(email.id);
        };

        // insert into container
        container.appendChild(row)
      });
    });
}