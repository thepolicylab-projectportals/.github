const { argv } = require("node:process");
const core = require("@actions/core");
const nodemailer = require("nodemailer");
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { document } = (new JSDOM(`...`)).window;

async function main() {
    let to = core.getInput('to', {required: false});
    console.log(to);
    if (!to) {
        core.warning('to value was not set');
        to = "heather_yu@brown.edu";
    }
    const arg = argv.slice(2);
    const file = arg[0];
    const query = JSON.parse(fs.readFileSync(file, {encoding:'utf8', flag:'r'}));
    console.log(query);

    try {
        const today = new Date();
        const greetingDiv = document.createElement("div");
        const projectDiv =  document.createElement("div");
        const endingDiv =  document.createElement("div");
        let numberStales = 0;

        for (let i = 0; i < (query.data.allProject.nodes).length; i++) {

            let status = query.data.allProject.nodes[i].status;
            let closeDate = Date.parse(query.data.allProject.nodes[i].opportunityCloses);
            let startDate = Date.parse(query.data.allProject.nodes[i].startDate);
            let endDate = Date.parse(query.data.allProject.nodes[i].endDate);
            let modifyDate = Date.parse(query.data.allProject.nodes[i].lastModified);
            console.log(`Status: ${status}
            closeDate: ${closeDate}`);

            let problems = [];

            switch (status) {
                default:
                    break;
                case "open":
                    if (closeDate < today){
                        problems.push("The opportunity date has passed, but project is marked open.");
                    }
                    if (startDate < today){
                        problems.push("The start date has passed, but project is marked open.");
                    }
                    if((today - modifyDate) > 90){
                        problems.push("It has been over 90 days since project's last modification.");
                    }
                    if (endDate < today){
                        problems.push("The project has ended, but is marked as open.");
                    }
                    break;
                case "ongoing":
                    if((today - modifyDate) > 90){
                        problems.push("It has been over 90 days since project's last modification.");
                    }
                    if (endDate < today){
                        problems.push("The project has ended, but is marked as ongoing.");
                    }
                    break;
            }

            if (problems.length > 0){
                addElement(`Project Title: ${query.data.allProject.nodes[i].title}`, projectDiv);
                addElement(`Contact Name: ${query.data.allProject.nodes[i].mainContact.name}`, projectDiv);
                addElement(`Contact Email: ${query.data.allProject.nodes[i].mainContact.email}`, projectDiv);
                addElement(`URL: ${query.data.allProject.nodes[i].slug}`, projectDiv);
                addElement(`Possible Problems: ${problems.join('; ')}`, projectDiv);
                projectDiv.append(document.createElement("br"));
                numberStales++;
            }

        }

        addElement("Please reach out to the appropriate contacts for the following projects and update these projects within their respective CMS sites.", endingDiv);
        addElement("Hello!", greetingDiv);
        addElement("The following projects may be out of date: ", greetingDiv);

        if (numberStales > 0) {

            // Send out an email
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            let testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: to, // list of receivers
                subject: "Hello ✔", // Subject line
                html: document, // html body
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }


    } catch (error) {
        core.setFailed(`Action failed with the following error: ${error}`);
    }
}


function addElement(text, newDiv) {

    // and give it some content
    const newContent = document.createElement("p");
    newContent.innerHTML = text;

    // add the text node to the newly created div
    newDiv.appendChild(newContent);
}

main().catch(console.error);