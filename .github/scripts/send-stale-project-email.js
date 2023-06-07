const { argv } = require("node:process");
const core = require("@actions/core");
const nodemailer = require("nodemailer");
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { document } = (new JSDOM(`...`)).window;

async function main() {
    const arg = argv.slice(2);
    const file = arg[0];
    const query = JSON.parse(fs.readFileSync(file, {encoding:'utf8', flag:'r'}));
    let inputs = JSON.parse(arg[1]);

    let to = inputs.to;
    let site = inputs.site;

    if (!to) {
        core.warning('to value was not set');
        to = "heather_yu@brown.edu";
    }

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
                addElement(`URL: ${site}/${query.data.allProject.nodes[i].slug}`, projectDiv);
                addElement(`Possible Problems: ${problems.join(' ')}`, projectDiv);
                projectDiv.append(document.createElement("br"));
                numberStales++;
            }

        }

        addElement("Hello!", greetingDiv);
        greetingDiv.append(document.createElement("br"));
        addElement("Please reach out to the appropriate contacts for the following projects and confirm that the information within its CMS site is not out-of-date.", greetingDiv);
        greetingDiv.append(document.createElement("br"));

        if (numberStales > 0) {

            // Send out an email
            // This smtp was set up by Brown OIT unix team -- this will only work on Brown internal network (such as BKE)
            // Auth not needed at this time
            let EMAIL_SMTP = "smtp://mail-relay.brown.edu:25";
            let transporter;
            if (inputs.emailtype == "test") {
                EMAIL_SMTP = undefined;
            }
            // Generate test SMTP service account
            if (EMAIL_SMTP !== undefined) {
                transporter = nodemailer.createTransport(EMAIL_SMTP);
                console.debug("initialized smtp server: %s", EMAIL_SMTP);
            } else {
                let testAccount = await nodemailer.createTestAccount();
                transporter = nodemailer.createTransport({
                    host: "smtp.ethereal.email",
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: testAccount.user, // generated ethereal user
                        pass: testAccount.pass, // generated ethereal password
                    },
                });
                console.debug("initialized ethereal email smtp server");
            }

            console.debug("initialized smtp server: %s", EMAIL_SMTP);


            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"Brown Policy Lab" <no-reply@brown.edu>', // sender address
                to: to, // list of receivers
                subject: "Project Portal Update: Out of Date Projects", // Subject line
                html: `${greetingDiv.outerHTML}${projectDiv.outerHTML}${endingDiv.outerHTML}`, // html body
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