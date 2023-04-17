const core = require("@actions/core");

async function main() {
    try {
        const query = core.getInput(query);
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

            if (problems){
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
            core.exportVariable('body', `${greetingDiv}${projectDiv}${endingDiv}`);
        }
    } catch (error) {
        core.setFailed(`Action failed with error ${error}`);
    }
}


function addElement(text, newDiv) {

    // and give it some content
    const newContent = document.createElement("p");
    newContent.innerHTML = text;

    // add the text node to the newly created div
    newDiv.appendChild(newContent);
}

main()