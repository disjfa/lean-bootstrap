const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('vue/index', {
    layout: 'vue',
    title: 'Bootstrap playground',
  });
});

module.exports = router;
