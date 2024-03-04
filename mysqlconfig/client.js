const knex = require('knex');

class ClienteSQLusuarios {

    constructor(options) {
        this.knex = knex(options)
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
        return this.knex('usuarios').insert(productos)
    }

    listarUsuarios() {
        return this.knex('usuarios').select('*')
    }

    comprobarDatos(DataUser, DataPass){
        return this.knex('usuarios').where({ user: DataUser, password:DataPass})
    }

    close() {
        this.knex.destroy()
    }
}



class ClienteSQLboxes {

    constructor(options) {
        this.knex = knex(options)
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
        return this.knex('boxes').insert(productos)
    }

    listarBoxes() {
        return this.knex('boxes').select('*')
    }
    listarBoxesArea(dataBox) {
        return this.knex('boxes').where({ tipoBox: dataBox})
    }
    listarBoxId(num) {
        return this.knex('boxes').where({ idBox: num})
    }

    close() {
        this.knex.destroy()
    }
}
//-------------------------------------------------------------------------------------------------------//


module.exports = {ClienteSQLusuarios, ClienteSQLboxes}