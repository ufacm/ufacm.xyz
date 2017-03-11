'use strict';
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: '<emal>',
		pass: '<password>'
	}
});

let Mailer = new function() {
	this.contactStudent = function(email, username, password) {
		let mailOptions = {
			from: '"UF Programming Team" <noreply@ufacm.xyz>',
			to: 'cal2u@ufl.edu',
			subject: 'Login Information for OHSPC 2017',
			text: "Here are your credentials for the University of Florida's Online High School Programming Contest. "+
						"The contest will be held Saturday, March 25th from 2-4pm.\n\n"+
						"Username: "+username+"\n"+
						"Password: "+password+"\n"
		};
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log("Message %s sent: %s", info.messageId, info.response);
		});
	};
}

module.exports = Mailer
