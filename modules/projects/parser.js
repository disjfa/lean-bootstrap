let fs = require('fs');

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

            if (project) {
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
                }
                for (let myVariable of myData) {
                    if (myVariable.name === item.name) {
                        item.value = myVariable.value;
                    }
                }
                varData.push(item);
            }

            resolve(varData);
        })
    });
};
