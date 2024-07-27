const express = require("express")
const bodyParser = require("body-parser")
const pg = require("pg")
const bcrypt = require("bcrypt")
const passport = require("passport")
const session = require("express-session")
const { Strategy } = require("passport-local")
const multer = require("multer")
const fs = require("fs")
const { parse } = require("csv-parse")
const path = require("path")
const router = express.Router();


router.use(session({
  secret: "TOPSECRET",
  resave: false,
  saveUninitialized: true,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24,
  }
}))

const saltRounds = 10;

router.use(passport.initialize());
router.use(passport.session())

const db = new pg.Client({
  user : "postgres",
  host : "localhost",
  database : "tacomail",
  password : "Parthi",
  port : 5432
})

const upload = multer({ dest: 'uploads/' });


db.connect();




router.use(bodyParser.urlencoded({ extended: true}))
router.use(express.static("public"))


router.get("/try", (req, res) => {

  res.render('./partials/try.ejs')

})

router.get("/signup", (req,res) =>{
  try {
      res.render("signup.ejs")
  } catch (err) {
      console.log(err)
  }
  
})

router.get("/upload", (req, res) => {
  try {
      res.render("./import/import.ejs")
  } catch (err) {
      console.log(err)
  }
})

// router.get("/upload2", (req, res) => {
// try {
//     res.render("./import/import2.ejs")
// } catch (err) {
//     console.log(err)
// }
// })
// router.get("/upload3", (req, res) => {
// try {
//     res.render("./import/import3.ejs")
// } catch (err) {
//     console.log(err)
// }
// })
// router.get("/upload4", (req, res) => {
// try {
//     res.render("./import/import4.ejs")
// } catch (err) {
//     console.log(err)
// }
// })
// router.get("/upload5", (req, res) => {
// try {
//     res.render("./import/import5.ejs")
// } catch (err) {
//     console.log(err)
// }
// })

router.get("/secrets", (req, res) => {
  if (req.isAuthenticated()) {
      res.render("secrets.ejs")
  } else {
      res.redirect("/")
  } 
})

router.get("/subs", (req, res) => {
  try {
      res.render("subscribe.ejs")

  } catch (err) {
      console.log(err)
  }
      
})

router.get("/add", (req, res) =>{
  try {
      res.render("addproduct.ejs")
  } catch (err) {
      console.log(err)
  }
  
})

router.post("/subs", async (req, res) => {

  const mail = req.body.user
  const user = req.body.mail
  const list = req.body.list

  console.log(user)
  console.log(mail)
  console.log(list)

  try {
      const result = await db.query("INSERT INTO  (name, email, list) VALUES ($1, $2, $3) ", [user, mail,list])
      console.log(result)
  }
  catch (err) {
      console.log(err)
      res.render("secrets")
      console.log("user details dosnt exists")
      res.send("User details already exist")

      
  } 
})



router.get("/", (req, res) =>{
  res.render("login.ejs")
})

router.post("/signup", async (req,res) =>{

  const usern = req.body.user
  const mailid = req.body.username
  const pass = req.body.password
  
  console.log(usern)
  console.log(mailid)
  console.log(pass)
  try {
      const result = await db.query('SELECT email FROM auth WHERE email = $1', [mailid])

  if (result.rows.length > 0) {
      res.send("Username or email Already taken !!!")
  }  else {
      bcrypt.hash(pass, saltRounds, async (err, hash) => {
          if (err){
              console.log(`Error hashing password ${err}`)
          } else {
              const result = await db.query("INSERT INTO auth (username, email, password) VALUES ($1, $2, $3) RETURNING *", [usern, mailid, hash])
      // console.log(result)
      const user = result.rows[0]
      req.login(user, (err) =>{
          console.log(err)
          res.redirect("/secrets")
      })
          }
      })
      
  }

  } catch (err) {
      console.log(err)
      res.render("secrets")
      console.log("user details dosnt exists")
      res.send("User details already exist")

      
  } 
  
  
})

router.post('/', passport.authenticate("local", {
  successRedirect: "/secrets",
  failureRedirect: "/"
}));


passport.use(new Strategy(async function verify(username, password, cb) {
  console.log(username)
  try {
      const data = await db.query("SELECT * FROM auth WHERE (email) = $1", [username])
      
      
      if (data.rows.length > 0) {

      const user = data.rows[0]
      const saltedPassword = user.password

      bcrypt.compare(password, saltedPassword, (err, result) =>{
      if (err) {
          return cb(err)
      }
      else {
          if (result) {
              return cb(null, user)
          } else {
              return cb(null, false)
          }
      }
      
      })

          
      } else {
          return cb("Something went wrong please check the password")
          
      }

  } catch (err) {
      return cb(err)
      
  }
}))

router.get("/additem", (req, res) =>{
  try {
      res.render("./add/add.ejs")
  } catch (err) {
      console.log(err)
  }
  
})

router.post('/additem', async (req, res) => {
  const username = req.body.user
  const email = req.body.mail

  // console.log(username)
  // console.log(email)

  const resutl = await db.query("INSERT INTO demo (name, email) VALUES ($1, $2) RETURNING *", [username, email])
  console.log("users added")
  console.log(resutl)


})

// router.get("/additem2", (req, res) =>{
// try {
//     res.render("./add/add2.ejs")
// } catch (err) {
//     console.log(err)
// }

// })

// router.post('/additem2', async (req, res) => {
// const username = req.body.user
// const email = req.body.mail

// // console.log(username)
// // console.log(email)

// const resutl = await db.query("INSERT INTO demo2 (name, email) VALUES ($1, $2) RETURNING *", [username, email])
// console.log("users added")
// console.log(resutl)


// })

// router.get("/additem3", (req, res) =>{
// try {
//     res.render("./add/add3.ejs")
// } catch (err) {
//     console.log(err)
// }

// })

// router.post('/additem3', async (req, res) => {
// const username = req.body.user
// const email = req.body.mail

// // console.log(username)
// // console.log(email)

// const resutl = await db.query("INSERT INTO demo3 (name, email) VALUES ($1, $2) RETURNING *", [username, email])
// console.log("users added")
// console.log(resutl)


// })

// router.get("/additem4", (req, res) =>{
// try {
//     res.render("./add/add4.ejs")
// } catch (err) {
//     console.log(err)
// }

// })

// router.post('/additem4', async (req, res) => {
// const username = req.body.user
// const email = req.body.mail

// // console.log(username)
// // console.log(email)

// const resutl = await db.query("INSERT INTO demo4 (name, email) VALUES ($1, $2) RETURNING *", [username, email])
// console.log("users added")
// console.log(resutl)


// })

// router.get("/additem5", (req, res) =>{
// try {
//     res.render("./add/add5.ejs")
// } catch (err) {
//     console.log(err)
// }

// })

// router.post('/additem5', async (req, res) => {
// const username = req.body.user
// const email = req.body.mail

// // console.log(username)
// // console.log(email)

// const resutl = await db.query("INSERT INTO demo5 (name, email) VALUES ($1, $2) RETURNING *", [username, email])
// console.log("users added")
// console.log(resutl)


// })

router.get('/dashboard', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM demo');
    const data = result.rows;
    res.render('dashboard/dashboard.ejs', { data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM demo WHERE id = $1', [id]);
    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting data');
  }
});


// router.get('/dashboard2', async (req, res) => {
//   try {
//     const result = await db.query('SELECT * FROM demo2');
//     const data = result.rows;
//     res.render('./dashboard/dashboard2.ejs', { data });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error fetching data');
//   }
// });

// router.delete('/delete/:id', async (req, res) => {
//   const id = req.params.id;
//   try {
//     await db.query('DELETE FROM demo2 WHERE id = $1', [id]);
//     res.json({ message: 'Data deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error deleting data');
//   }
// });


// router.get('/dashboard3', async (req, res) => {
//   try {
//     const result = await db.query('SELECT * FROM demo3');
//     const data = result.rows;
//     res.render('./dashboard/dashboard3.ejs', { data });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error fetching data');
//   }
// });

// router.delete('/delete/:id', async (req, res) => {
//   const id = req.params.id;
//   try {
//     await db.query('DELETE FROM demo3 WHERE id = $1', [id]);
//     res.json({ message: 'Data deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error deleting data');
//   }
// });


// router.get('/dashboard4', async (req, res) => {
//   try {
//     const result = await db.query('SELECT * FROM demo4');
//     const data = result.rows;
//     res.render('./dashboard/dashboard4.ejs', { data });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error fetching data');
//   }
// });

// router.delete('/delete/:id', async (req, res) => {
//   const id = req.params.id;
//   try {
//     await db.query('DELETE FROM demo4 WHERE id = $1', [id]);
//     res.json({ message: 'Data deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error deleting data');
//   }
// });


// router.get('/dashboard5', async (req, res) => {
//   try {
//     const result = await db.query('SELECT * FROM demo5');
//     const data = result.rows;
//     res.render('./dashboard/dashboard5.ejs', { data });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error fetching data');
//   }
// });

// router.delete('/delete/:id', async (req, res) => {
//   const id = req.params.id;
//   try {
//     await db.query('DELETE FROM demo5 WHERE id = $1', [id]);
//     res.json({ message: 'Data deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error deleting data');
//   }
// });



router.post('/upload', upload.single('csvFile'), async (req, res) => {
  const file = req.file;
  

  try {
    const csvData = await parseFile(file.path);
    await insertData(csvData, db);
    res.send('CSV data uploaded and inserted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading CSV');
  }
});

const parseFile = async (filePath) => {
  const fileData = fs.readFileSync(filePath);
  const records = await parse(fileData, {
    columns: true, 
    skip_empty_lines: true
  });
  return records;
};

async function insertData(data, db) {
  if (!Array.isArray(data)) {
    console.error('Data is not an array:', data);
    return; 
  }

  const client = await db.connect();
  try {
    for (const row of data) {
      await db.query('INSERT INTO demo (id, name, email) VALUES ($1, $2, $3)', [row.id, row.name, row.email]);
    }
  } catch (error) {
  //   console.error(error);
    throw error;
  } 
}


passport.serializeUser((user, cb) => {
  cb(null, user);
})

passport.deserializeUser((user, cb) => {
  cb(null, user);
})



router.get("/",(req,res,next)=>{
  res.render('home.ejs',{url:req.protocol+"://"+req.headers.host})
})

router.get("/about",(req,res,next)=>{
  res.render('about.ejs',{url:req.protocol+"://"+req.headers.host})
})


module.exports = router;