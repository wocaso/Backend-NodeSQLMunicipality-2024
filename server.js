const express = require("express");
const { Server: HttpServer } = require("http");

const app = express();
const session = require("express-session");
const httpServer = HttpServer(app);
const cors = require("cors");
const { options } = require("./mysqlconfig/options/mysqlconn.js");
const { ClienteSQLusuarios, ClienteSQLboxes } = require("./mysqlconfig/client.js");

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(
  session({
    secret: "secreto",
    resave: true,
    saveUninitialized: true,
  })
);

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
async function conectarUsuarios() {
  const con = new ClienteSQLusuarios(options);
  return con;
}

conectarUsuarios().then((res) => {
  const sql = res;
  sql
    .listarUsuarios()
    .then((items) => {
      app.get("/", (req, res) => {
        res.send(items);
      });
    })
    .finally(() => {
      sql.close();
    });
});
//sistema de logeo
app.get("/api/login/:user/:pass", (req, res) => {
  const user = req.params.user;
  const pass = req.params.pass;
  
  conectarUsuarios().then((data) => {
    const sql = data;
    sql
      .comprobarDatos(user, pass)
      .then((items) => {
        if (!req.session.userSession) {
          req.session.userSession = items;
          res.send(req.session.userSession);
        } else {
          res.send(req.session.userSession);
        }
      })
      .finally(() => {
        sql.close();
      });
  });
});


// aca crea tu olvidar
app.get("/userSession", (req, res) => {
  res.send(req.session.userSession)
})

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
async function conectarBoxes() {
  const con = new ClienteSQLboxes(options);
  return con;
}
conectarBoxes().then((res) => {
  const sql = res;
  sql
    .listarBoxes()
    .then((items) => {
      app.get("/api/boxes", (req, res) => {
        res.send(items);
      });
    })
    .finally(() => {
      sql.close();
    });
});

app.get("/api/boxes/:tipoBox", (req, res) => {
  const tipoBox = req.params.tipoBox
  
  conectarBoxes().then((data) => {
    const sql = data;
    sql
      .listarBoxesArea(tipoBox)
      .then((items) => {
        res.send(items);
      })
      .finally(() => {
        sql.close();
      });
  });
});

app.get("/api/boxes/boxInd/:numBox", (req, res) => {
  const numBox = parseInt(req.params.numBox)
  conectarBoxes().then((data) => {
    const sql = data;
    sql
      .listarBoxId(numBox)
      .then((items) => {
        res.send(items);
      })
      .finally(() => {
        sql.close();
      });
  });
});
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

const PORT = 8080;

httpServer.listen(PORT, () => {
  console.log("servidor escuchando en el puerto " + PORT);
});
