const fs = require('fs');

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;',
  };

  return text.replace(/[&<>"']/g, m => map[m]);
}

exports.parseFile = (project) => {
  const bootstrapVariables = require.resolve('bootstrap/scss/_variables.scss');

  return new Promise((resolve) => {
    fs.readFile(bootstrapVariables, (err, data) => {
      if (err) {
        throw err;
      }

      const bsdata = data.toString();

      const sassVariables = bsdata.match(/^\$[^]+?\;/gm);
      const myData = [];

      if (project && project.content) {
        const myVariables = project.content.match(/^\$[^]+?\;/gm);
        for (let variable of myVariables) {
          variable = variable.replace(';', '');
          const varDetails = variable.split(':');
          if (varDetails.length === 2) {
            myData.push({
              name: varDetails[0].trim(),
              value: varDetails[1].trim(),
            });
          }
        }
      }

      const varData = [];
      for (let variable of sassVariables) {
        variable = variable.replace('!default;', '');
        const varDetails = variable.split(':');
        let item = {};

        if (varDetails.length === 2) {
          item = {
            name: varDetails[0].trim(),
            value: varDetails[1].trim(),
            original: varDetails[1].trim(),
            altered: false,
          };

          const foundItem = myData.find(my => my.name === item.name);
          if (foundItem && foundItem.value !== item.value) {
            item = Object.assign(item, {
              value: foundItem.value,
              altered: true,
            });
          }
          varData.push(item);
        }
      }

      resolve(varData);
    });
  });
};

function sortObject(o) {
  return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}

exports.groupData = (varData) => {
  const groups = {};
  for (item of varData) {
    const itemGroupName = item.name.split('-');
    const groupName = itemGroupName[0].replace(/\$/, '');
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(item);
  }

  return sortObject(groups);
};
