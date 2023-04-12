const core = require("@actions/core");

// const query = core.getInput(query);      // get query from the yml file?
const query = {
    "data": {
        "allProject": {
            "nodes": [
                {
                    "endDate": "2016-12-15",
                    "mainContact": {
                        "email": null,
                        "name": "Horace I"
                    },
                    "opportunityCloses": "2022-10-28",
                    "slug": "ongoing-project2",
                    "startDate": "2022-06-17",
                    "status": "ongoing",
                    "title": "ongoing 2",
                    "lastModified": "2022-08-31T20:33:19.394+00:00"
                },
                {
                    "endDate": "2016-12-15",
                    "mainContact": {
                        "email": null,
                        "name": "Horace I"
                    },
                    "opportunityCloses": "2022-10-28",
                    "slug": "ongoing-project",
                    "startDate": "2022-06-17",
                    "status": "ongoing",
                    "title": "ongoing 1",
                    "lastModified": "2022-08-31T20:33:19.394+00:00"
                },
                {
                    "endDate": "2016-12-15",
                    "mainContact": {
                        "email": "isabel@gsdc.ccv.brown.edu",
                        "name": "Isabel"
                    },
                    "opportunityCloses": "2022-10-28",
                    "slug": "open-project-2",
                    "startDate": "2022-06-17",
                    "status": "open",
                    "title": "open 2",
                    "lastModified": "2022-08-31T20:33:19.394+00:00"
                },
                {
                    "endDate": "2016-12-15",
                    "mainContact": {
                        "email": "isabel@gsdc.ccv.brown.edu",
                        "name": "Isabel"
                    },
                    "opportunityCloses": "2022-10-28",
                    "slug": "open-project",
                    "startDate": "2022-06-17",
                    "status": "open",
                    "title": "open 1",
                    "lastModified": "2022-08-31T20:33:19.394+00:00"
                },
                {
                    "endDate": "2016-12-15",
                    "mainContact": {
                        "email": null,
                        "name": "Horace I"
                    },
                    "opportunityCloses": "2022-10-28",
                    "slug": "open-project3",
                    "startDate": "2022-06-17",
                    "status": "open",
                    "title": "Open Project 3",
                    "lastModified": "2022-08-31T20:33:19.394+00:00"
                },
                {
                    "endDate": "2016-12-15",
                    "mainContact": {
                        "email": null,
                        "name": "Horace I"
                    },
                    "opportunityCloses": "2022-10-28",
                    "slug": "open-project4",
                    "startDate": "2022-06-17",
                    "status": "open",
                    "title": "Open Project 4",
                    "lastModified": "2022-08-31T20:33:19.394+00:00"
                },
                {
                    "endDate": "2016-12-15",
                    "mainContact": {
                        "email": null,
                        "name": "Horace I"
                    },
                    "opportunityCloses": "2022-10-28",
                    "slug": "open-project5",
                    "startDate": "2022-06-17",
                    "status": "open",
                    "title": "Open Project 5",
                    "lastModified": "2022-08-31T20:33:19.394+00:00"
                },
                {
                    "endDate": "2016-12-15",
                    "mainContact": {
                        "email": null,
                        "name": "Horace I"
                    },
                    "opportunityCloses": "2022-10-28",
                    "slug": "open-project6",
                    "startDate": "2022-06-17",
                    "status": "open",
                    "title": "Open Project 6",
                    "lastModified": "2022-08-31T20:33:19.394+00:00"
                },
                {
                    "endDate": "2016-12-15",
                    "mainContact": {
                        "email": null,
                        "name": "Horace I"
                    },
                    "opportunityCloses": "2022-10-28",
                    "slug": "completed-project",
                    "startDate": "2022-06-17",
                    "status": "completed",
                    "title": "completed 1",
                    "lastModified": "2022-08-31T20:33:19.394+00:00"
                },
                {
                    "endDate": "2016-12-15",
                    "mainContact": {
                        "email": null,
                        "name": "Horace I"
                    },
                    "opportunityCloses": "2022-10-28",
                    "slug": "completed-project2",
                    "startDate": "2022-06-17",
                    "status": "completed",
                    "title": "completed 2",
                    "lastModified": "2022-11-04T12:16:49.378+00:00"
                }
            ]
        }
    },
    "extensions": {}
};


const today = new Date();
const greetingDiv = document.createElement("div");
const projectDiv =  document.createElement("div");
const endingDiv =  document.createElement("div");

addElement("Hello!", greetingDiv);
addElement("The following projects may be out of date: ", greetingDiv);


/*
Possible problems:
>90days last modified
opportunity has recently closed (open only)
start date has recently passed (open only)
end date has passed, but marked as STATUS
*/

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
    }

}

addElement("Please reach out to the appropriate contacts for these projects and update these projects within their respective CMS sites.", endingDiv);
function addElement(text, newDiv) {

    // and give it some content
    const newContent = document.createElement("p");
    newContent.innerHTML = text;

    // add the text node to the newly created div
    newDiv.appendChild(newContent);
}


core.exportVariable('body', `${greetingDiv}${projectDiv}${endingDiv}`);



