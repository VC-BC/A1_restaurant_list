// Express, Handlebars, restaurant.JSON
const express = require('express')
const exphbs = require('express-handlebars')
const restaurantsData = require('./restaurant.json').results
const app = express()
const port = 3000

// Template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


// Static Files
app.use(express.static('public'))

// Routes
app.get('/', (req, res) => {
  res.render('index', { restaurantsData })
})

// Search
app.get('/search', (req, res) => {
  // 輸入不正確時自動導回首頁，提升使用體驗
  if (!req.query.keywords) {
    return res.redirect('/')
  }

  //轉小寫才能順利用include
  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()

  const filterRestaurantsData = restaurantsData.filter(
    data =>
      data.name.toLowerCase().includes(keyword) ||
      data.category.includes(keyword)
  )
  res.render("index", { restaurantsData: filterRestaurantsData, keywords })
})


// Show
app.get("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  const restaurantData = restaurantsData.find(
    data => data.id === Number(restaurantId)
    // 另一種寫法-> e.id === +restaurantId
  )
  res.render("show", { restaurantData })
})


// Listen to the server
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})