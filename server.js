const express = require("express");
const { Server: HttpServer } = require("http");

const app = express();
const session = require("express-session");
const httpServer = HttpServer(app);
const cors = require("cors");
const { options } = require("./mysqlconfig/options/mysqlconn.js");
const { ClienteSQLusuarios, ClienteSQLboxes, ClienteSQLturnos } = require("./mysqlconfig/client.js");

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
//sistema de logeo y usuarios
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

app.get("/api/login/:user/:pass", (req, res) => {
  const user = req.params.user;
  const pass = req.params.pass;
  
  conectarUsuarios().then((data) => {
    const sql = data;
    sql
      .comprobarDatos(user, pass)
      .then((items) => {
        req.session.userSession = items;
        res.send(items);
        // if (!req.session.userSession) {
        //   console.log("no habia sesion")

        // } else {
        //   console.log("ya habia sesion")
        //   res.send(req.session.userSession);
        // }
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

app.get("/deleteSession", (req, res) => {
req.session.destroy( err => {
  if (err){
    res.json({error: "algo hiciste mal", descripcion: err})
  } else {
    res.json({respuesta: "Hasta luego "}) 
  }
})
})

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//Sistema Boxes
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

app.put("/api/boxes/boxInd/select/:idBox", (req, res) => {
  const idBox = parseInt(req.params.idBox)
  conectarBoxes().then((data) => {
    const sql = data;
    sql
      .seleccionarBoxEstado(idBox)
      .then(() => {
        res.send("box seleccionado");

      })
      .finally(() => {
        sql.close();
      });
  });
});
app.put("/api/boxes/boxInd/open/:idBox", (req, res) => {
  const idBox = parseInt(req.params.idBox)
  conectarBoxes().then((data) => {
    const sql = data;
    sql
      .abrirBoxEstado(idBox)
      .then(() => {
        res.send("box abierto");

      })
      .finally(() => {
        sql.close();
      });
  });
});
app.put("/api/boxes/boxInd/close/:idBox", (req, res) => {
  const idBox = parseInt(req.params.idBox)
  conectarBoxes().then((data) => {
    const sql = data;
    sql
      .cerrarBoxEstado(idBox)
      .then(() => {
        res.send("box cerrado");

      })
      .finally(() => {
        sql.close();
      });
  });
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
//Sistema Turnos
async function conectarTurnos() {
  const con = new ClienteSQLturnos(options);
  return con;
}
// const objetoAInsertar = {
//   dniContribuyente: 12345678,
//   tipoTurno: 'Consulta',
//   fechaHora: '2024-03-18 10:30:00',
//   idBoxLlamador: 2,
//   reLlamado: 0,
//   numeroTurno: 'A001'
// };

app.post("/api/Agregarturno/:dni/:tipoTurno/:fecha/:numTurno", (req, res) => {
  const dni = parseInt(req.params.dni);
  const tipoTurno = req.params.tipoTurno;
  const fecha = req.params.fecha;
  const numTurno = req.params.numTurno;

  const objetoAInsertar = {
    dniContribuyente: dni,
    tipoTurno: tipoTurno,
    fechaHora: fecha,
    idBoxLlamador: 0,
    reLlamado: 0,
    numeroTurno: numTurno
  };
  conectarTurnos().then((data) => {
    const sql = data;
    sql
      .insertarTurno(objetoAInsertar)
      .then(() => {
        res.send("turno Agregado");

      })
      .finally(() => {
        sql.close();
      });
  });
});

app.get("/api/tipoDeTurno", (req, res) => {
  conectarTurnos().then((data) => {
    const sql = data;
    sql
      .listarTipoDeTurno()
      .then((data) => {
        res.send(data);

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
