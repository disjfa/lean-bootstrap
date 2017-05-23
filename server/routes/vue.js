const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('vue/index', {
    layout: 'vue',
    title: 'Index',
  });
});

module.exports = router;
