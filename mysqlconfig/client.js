const knex = require("knex");
//---------------------------------------------------------------------------------------------------------------------------------------------------//
class ClienteSQLusuarios {
  constructor(options) {
    this.knex = knex(options);
  }

  // crearTabla() {
  //     return this.knex.schema.dropTableIfExists('usuarios')
  //         .finally(() => {
  //             return this.knex.schema.createTable("productos", table =>{
  //                 table.increments("id").primary();
  //                 table.string("tittle", 50).notNullable();
  //                 table.float("price")
  //                 table.string("thumbnail", 80).notNullable();
  //             })
  //         })
  // }

  insertarProductos(productos) {
    return this.knex("usuarios").insert(productos);
  }

  listarUsuarios() {
    return this.knex("usuarios").select("*");
  }

  comprobarDatos(DataUser, DataPass) {
    return this.knex("usuarios").where({ user: DataUser, password: DataPass });
  }

  close() {
    this.knex.destroy();
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------//

class ClienteSQLboxes {
  constructor(options) {
    this.knex = knex(options);
  }

  // crearTabla() {
  //     return this.knex.schema.dropTableIfExists('usuarios')
  //         .finally(() => {
  //             return this.knex.schema.createTable("productos", table =>{
  //                 table.increments("id").primary();
  //                 table.string("tittle", 50).notNullable();
  //                 table.float("price")
  //                 table.string("thumbnail", 80).notNullable();
  //             })
  //         })
  // }

  insertarBoxes(productos) {
    return this.knex("boxes").insert(productos);
  }

  listarBoxes() {
    return this.knex("boxes").select("*");
  }
  listarBoxesArea(dataBox) {
    return this.knex("boxes").where({ tipoBox: dataBox }).where({ estado: 0 });
  }
  listarBoxId(num) {
    return this.knex("boxes").where({ idBox: num });
  }

  cerrarBoxEstado(num) {
    return this.knex("boxes").where({ idBox: num }).update({ estado: 0 });
  }
  seleccionarBoxEstado(num) {
    return this.knex("boxes").where({ idBox: num }).update({ estado: 1 });
  }
  abrirBoxEstado(num) {
    return this.knex("boxes").where({ idBox: num }).update({ estado: 2 });
  }
  close() {
    this.knex.destroy();
  }
}
//-------------------------------------------------------------------------------------------------------//

class ClienteSQLturnos {
  constructor(options) {
    this.knex = knex(options);
  }
  listarTurnos() {
    return this.knex("turnos").select("*");
  }
  buscarLetraTurno(nom) {
    return this.knex("tipoDeTurno")
      .where({ nombreTipoDeTurno: nom })
      .select("letraTipoDeTurno");
  }
  // listarTurnosPorArea(letra) {
  //   return this.knex("turnos").where({ letraTurno: letra }).select("*");
  // }
  buscarUltimoTurnoPorArea(letra) {
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Establece la hora a las 00:00:00

    return this.knex("turnos")
      .where({ letraTurno: letra })
      .where("fechaHora", ">=", fechaActual) // Filtrar por la fecha actual o posterior
      .where("fechaHora", "<", new Date(fechaActual.getTime() + 86400000)) // Hasta las 23:59:59 del mismo día
      .orderBy("fechaHora", "desc")
      .limit(1)
      .pluck("numeroTurno");
  }
//hacer turno por area y en espera 
  buscarTurnosPorArea(Area) {
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Establece la hora a las 00:00:00
    return this.knex("turnos")
      .where({ tipoTurno: Area })
      .where("fechaHora", ">=", fechaActual) // Filtrar por la fecha actual o posterior
      .where("fechaHora", "<", new Date(fechaActual.getTime() + 86400000))
      .where({estado: "En espera"})
      .orderBy("fechaHora", "asc")
  }

  listarTipoDeTurno() {
    return this.knex("tipoDeTurno").select("*");
  }

  insertarTurno(turno) {
    return this.knex("turnos").insert(turno);
  }

  close() {
    this.knex.destroy();
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------//

module.exports = { ClienteSQLusuarios, ClienteSQLboxes, ClienteSQLturnos };
