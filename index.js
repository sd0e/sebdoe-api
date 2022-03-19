var http = require("http");

const firebaseApp = require("firebase/app");
const firebaseDatabase = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyB0tknfEz5h0SjdptYPazyq1mSc_aeHFKs",
  authDomain: "sebdoe-blog.firebaseapp.com",
  databaseURL: "https://sebdoe-blog-default-rtdb.firebaseio.com",
  projectId: "sebdoe-blog",
  storageBucket: "sebdoe-blog.appspot.com",
  messagingSenderId: "47751545127",
  appId: "1:47751545127:web:75d2446cc9055f226e2902",
  measurementId: "G-J4JVRZJC86"
};

firebaseApp.initializeApp(firebaseConfig);
const db = firebaseDatabase.getDatabase();

http
  .createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://sebdoe.com');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Max-Age', 2592000);
    res.setHeader('Content-Type', 'application/xml');
    
    firebaseDatabase.get(
      firebaseDatabase.child(firebaseDatabase.ref(db), "/blog/posts")).then(
      (snapshot) => {
        const first = `
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
        <url>
          <loc>https://sebdoe.com/</loc>
          <priority>1.0</priority>
          <changefreq>daily</changefreq>
        </url>
        <url>
          <loc>https://sebdoe.com/about</loc>
          <priority>0.5</priority>
        </url>
        <url>
          <loc>https://sebdoe.com/category/javascript</loc>
          <priority>0.2</priority>
          <changefreq>weekly</changefreq>
        </url>
        <url>
          <loc>https://sebdoe.com/category/non-coding</loc>
          <priority>0.2</priority>
          <changefreq>weekly</changefreq>
        </url>
        <url>
          <loc>https://sebdoe.com/category/programming</loc>
          <priority>0.2</priority>
          <changefreq>weekly</changefreq>
        </url>
        <url>
          <loc>https://sebdoe.com/category/react</loc>
          <priority>0.2</priority>
          <changefreq>weekly</changefreq>
        </url>
        <url>
          <loc>https://sebdoe.com/category/gcse</loc>
          <priority>0.2</priority>
          <changefreq>weekly</changefreq>
        </url>
        `;

        const second = `
        </urlset>
        `;

        let middle = [];
        Object.keys(snapshot.val()).forEach((key) => {
          const postData = snapshot.val()[key];

          const postDate = new Date(Number(postData.date + '000'));

          const parseDateToString = date => {
            date = date.toString();
            if (date.length === 2) return date;
            else return '0' + date;
          }

          const postDateString = `${postDate.getFullYear()}-${parseDateToString(postDate.getMonth() + 1)}-${parseDateToString(postDate.getDate())}`

          middle.push(
            `\n<url>
              <loc>https://sebdoe.com/article/${key}</loc>
              <lastmod>${postDateString}</lastmod>
              <priority>0.6</priority>
            </url>`
          );
        });

        res.write(first + middle.join("") + second);
        res.end();
      }
      );
  })
  .listen(process.env.PORT || 8080);
