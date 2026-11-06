
"use strict";

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const phone = document.getElementById("contactPhone").value.trim();
        const subject = document.getElementById("contactSubject").value;
        const message = document.getElementById("contactMessage").value.trim();

        const messageBox = document.getElementById("contactFormMessage");

        if (name.length < 2) {
            messageBox.textContent = "Please enter a valid name.";
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            messageBox.textContent = "Please enter a valid email address.";
            return;
        }

        if (!/^[6-9][0-9]{9}$/.test(phone)) {
            messageBox.textContent = "Please enter a valid 10-digit mobile number.";
            return;
        }

        if (message.length < 10) {
            messageBox.textContent = "Please enter at least 10 characters.";
            return;
        }

        const emailBody = `
Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}
        `;

        const mailtoURL =
            "mailto:support@technova.com" +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(emailBody);

        messageBox.textContent = "Opening your email application...";

        window.location.href = mailtoURL;

    });

}
