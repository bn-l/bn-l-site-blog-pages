const Metalsmith = require('metalsmith')
const drafts = require('@metalsmith/drafts')
const layouts = require('@metalsmith/layouts')
const markdown = require('@metalsmith/markdown')
const sass = require('@metalsmith/sass')
const collections = require('@metalsmith/collections')
const postcss = require('@metalsmith/postcss')
const dev = process.env.NODE_ENV === 'development'
const DateTime = require("luxon").DateTime

const sitedata = {
  site: {
    base: 'http://127.0.0.1:8080',
    subject: 'bn-l',
    author: 'bn-l'
  },
  nav: [
    {path: 'index.html', label: 'Home'},
    {path: 'about.html', label: 'About'},
    {path: 'contact.html', label: 'Contact'}
  ],
  socials: {
    github: 'https://github.com/bn-l'
  }
}

function formatDate(value, format) {
  const dateParserObject = DateTime.fromFormat(value, "dd-LL-yy")
  const dt = new Date(dateParserObject);
  if (format === 'iso') {
    return dt.toISOString();
  } else if (format === 'year') {
    return dt.getFullYear();
  }
  const utc = dt.toUTCString().match(/(\d{1,2}) (.*) (\d{4})/)
  // returns: Mmm, dd, yyyy 
  return `${utc[2]} ${utc[1]}, ${utc[3]}`
}

function formattedDatesForPosts(files, metalsmith) {
  metalsmith.metadata().collections.posts.forEach(post => {
    if (post.date) {
      // modifies the "collection" object directly 
      post.displayDate = formatDate(post.date)
      // e.g.: Mmm, dd, yyyy 
      post.isoDate = formatDate(post.date, 'iso')
      // e.g.: 2022-11-30T04:02:13.964Z
      post.year = formatDate(post.date, 'year')
    }
  })

}


function noop() {}

Metalsmith(__dirname)
  .clean(true)
  .source('src/content')
  .destination('docs')
  .metadata(sitedata)
  .use(dev ? noop : drafts())
  .use(markdown())
  .use(collections({
    posts: {
      pattern: 'posts/**/*.html',
      reverse: true,
      sortBy: 'date'
    }
  }))
  .use(formattedDatesForPosts)
  .use(layouts({
    directory: 'src/pug',
    default: 'post.pug'
  }))
  .use(sass({
    entries: {
      'src/scss/styles.scss' : 'css/styles.css'
    }
  }))
  .use(dev ? postcss({
    plugins: [
      'autoprefixer',
      'cssnano'
    ],
    map: true
  }) : noop)
  .build((error, files) => {
    if (error) throw error
    console.log('Build finished')
  })