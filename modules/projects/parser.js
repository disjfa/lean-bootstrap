let fs = require('fs');

function escapeHtml(text) {
    let map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
}


exports.parseFile = (project) => {
    let bootstrapVariables = require.resolve('bootstrap/scss/_variables.scss');

    return new Promise((resolve) => {
        fs.readFile(bootstrapVariables, (err, data) => {
            if (err) {
                throw err;
            }

            let bsdata = data.toString();

            let sassVariables = bsdata.match(/^\$[^]+?\;/gm);
            let myData        = [];

            if (project && project.content) {
                let myVariables = project.content.match(/^\$[^]+?\;/gm);
                for (let variable of myVariables) {
                    variable       = variable.replace(';', '');
                    let varDetails = variable.split(':');
                    if (varDetails.length === 2) {
                        myData.push({
                            name: varDetails[0].trim(),
                            value: varDetails[1].trim(),
                        });
                    }
                }
            }

            let varData = [];
            for (let variable of sassVariables) {
                variable       = variable.replace('!default;', '');
                let varDetails = variable.split(':');
                let item       = false;

                if (varDetails.length === 2) {
                    item = {
                        name: varDetails[0].trim(),
                        value: varDetails[1].trim(),
                    };
                    for (let myVariable of myData) {
                        if (myVariable.name === item.name && item.value !== myVariable.value) {
                            item.original = item.value;
                            item.value = myVariable.value;
                            item.altered = true;
                        }
                    }
                    varData.push(item);
                }
            }

            resolve(varData);
        })
    });
};

function sortObject(o) {
    return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}

exports.groupData = (varData) => {
    let groups = {};
    for(item of varData) {
        let itemGroupName = item.name.split('-');
        let groupName = itemGroupName[0].replace(/\$/, '');
        if(!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(item);
    }

    return sortObject(groups);
};
