const Metalsmith = require('metalsmith')
const drafts = require('@metalsmith/drafts')
const layouts = require('@metalsmith/layouts')
// const markdown = require('@metalsmith/markdown')
const sass = require('@metalsmith/sass')
const collections = require('@metalsmith/collections')
const postcss = require('@metalsmith/postcss')
const dev = process.env.NODE_ENV === 'development'
const DateTime = require("luxon").DateTime
const markdown = require('metalsmith-markdownit')
const emoji = require('markdown-it-emoji');
const permalinks = require('@metalsmith/permalinks')
const jsBundle = require('@metalsmith/js-bundle')

const sitedata = {
  site: {
    base: dev ? "http://127.0.0.1:8080" : "https://blog.bn-l.net",
    subject: 'bn-l',
    author: 'bn-l'
  },
  nav: [
    {path: '', label: 'Home'},
    {path: 'about', label: 'About'},
    {path: 'contact', label: 'Contact'}
  ],
  socials: {
    github: 'https://github.com/bn-l'
  },
  DateTime: DateTime
}

function formatDate(value, format) {
  const dateParserObject = DateTime.fromFormat(value, "dd-LL-yy")
  const dt = new Date(dateParserObject);
  if (format === 'iso') {
    return dt.toISOString();
  } else if (format === 'year') {
    return dt.getFullYear();
  } else if (format === 'timestamp') {
    return dt.getTime();
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
      post.timestamp = formatDate(post.date, 'timestamp')
      if (post.updated) {
        post.updatedTimestamp  = formatDate(post.updated, 'timestamp')
      }
    }
  })

}

// so any small change means I need to redo the setting?

function noop() {}

var md = markdown({html: true});
md.parser
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-abbr'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-container'), "update")
  .use(require('markdown-it-container'), "info")
  .use(require('markdown-it-container'), "summary")


Metalsmith(__dirname)
  .clean(true)
  .source('src/content')
  .destination('docs')
  .metadata(sitedata)
  .use(dev ? noop : drafts())
  .use(md)
  .use(permalinks())
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
    default: 'post.pug',
    pattern: '**/*.html'
  }))
  .use(sass({
    entries: {
      'src/scss/styles.scss' : 'css/styles.css'
    }
  }))
  .use(
    jsBundle({
      entries: {
        index: 'src/scripts/index.js'
      },
      minify: !dev,
      sourcemap: dev,
      drop: !dev ? ['console', 'debugger'] : []
    })
  )
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