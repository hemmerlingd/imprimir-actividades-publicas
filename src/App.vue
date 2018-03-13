<template>
  <div id="app" class="container">
    <div class="row">
      <div class="col-md-12">
        <input type="button" class="btn btn-primary" value="Imprimir" @click="imprimir">
      </div>
    </div>
    <div class="row">  
      <div class="col-md-12" id="imprime">
        <v-server-table @sorted="onSorted" ref="tabla" :url="url" :columns="columns" :options="options"></v-server-table>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
export default {
  name: 'app',
  methods: {
    onSorted: function(orden){
      const columna = orden.ascending ? orden.column : '-' + orden.column;
      this.$refs.tabla.setOrder(columna, orden.ascending);
      return false;
    },
    imprimir: function(){
      print();
    }
  },
  beforeMount() {
    const hoy = new Date();
    const dia = hoy.getDate();
    const mes = hoy.getMonth()+1;
    const anio = hoy.getFullYear();
    this.url = `https://gobiernoabierto.cordoba.gob.ar/api/actividad-publica/?disciplina_id=109&inicia_LTE=${dia}-${mes}-${anio}-23-59-59&termina_GTE=${dia}-${mes}-${anio}-00-00-00`;
    this.urlBase = this.url;
  },
  data: function() {
    return {
      url: "https://gobiernoabierto.cordoba.gob.ar/api/actividad-publica/?disciplina_id=109&termina_GTE=01-01-2018-23-59-59&inicia_LTE=01-01-2018-00-00-00",
      urlBase: "https://gobiernoabierto.cordoba.gob.ar/api/actividad-publica/?disciplina_id=109&termina_GTE=01-01-2018-23-59-59&inicia_LTE=01-01-2018-00-00-00",
      columns: ['titulo', 'descripcion_txt', 'inicia', 'termina', 'nombrelugar', 'lugardir' ],
      options: {
        columnsClasses: {
          titulo: 'col-xs-1 col-md-1',
          descripcion_txt: 'col-xs-1 col-md-6 descripcion',
          inicia: 'col-xs-1 col-md-1',
          termina: 'col-xs-1 col-md-1',
          nombrelugar: 'col-xs-1 col-md-2',
          lugardir: 'col-xs-1 col-md-1'
        },
        dateColumn: ['inicia','termina'],
        byColumn: false,
        datepickerOptions: {
          showDropdowns: true
        },
        sortable: ['inicia','termina'],
        headings: {
          titulo: 'Titulo',
          descripcion_txt: 'Descripción',
          inicia: 'Desde',
          termina: 'Hasta',
          nombrelugar: 'Lugar',
          lugardir: "Dirección"
        },
        requestKeys: {
          orderBy: 'ordering',
          ascending: 'ordering',
          limit: 'page_size',
          page:'page',
          query:'q',
        },
        texts: {
          count: "Mostrando {from} a {to} de {count} registros|{count} registros| 1 registro",
          filter: "Filtrar:",
          filterPlaceholder: "Buscar",
          limit: "Resultados por Página:",
          page: "Página:",
          noResults: "Sin Resultados",
          filterBy: "Filtrar por {column}",
          loading: 'Cargando...',
          defaultOption: 'Seleccionar {column}',
          columns: 'Columnas'
        },
        requestFunction: function (data) {
          return axios.get(this.url, {
            params: data
          })
          .catch(function (e) {
            this.dispatch('error', e);
          }
          .bind(this));
        },
        responseAdapter: function (response) {
          const data = response.data.results.map(function(dato){
            moment.locale('es');
            dato.inicia = moment(dato.inicia).format('DD MMM YYYY, HH:mm:ss');
            dato.termina = moment(dato.termina).format('DD MMM YYYY, HH:mm:ss');
            dato.nombrelugar = dato.lugar ? dato.lugar.nombre : '';
            dato.lugardir = dato.lugar ? dato.lugar.direccion : '';
            return dato;
          });
          return {
            data: data,
            count: response.data.count
          }
        }
      }
    }
  }
}
</script>
<style scoped>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}
input{
  margin-top: 10px;
}
@media print{
  .VuePagination__count,.VuePagination,.VueTables__sort-icon,input, select,label{display: none !important;}
  table td{ min-width: auto !important; }
}
table td{
  min-width: 100px;
}

table td:first-child{
  min-width: 200px;
}
</style>
