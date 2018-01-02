<template>
  <div id="app">
    <div class="row">
      <div class="col-md-4 col-md-offset-4">
        <label>Filtro por Audiencias</label> 
        <select class="form-control" v-model="audienciaSeleccionada">
          <option selected value="0">Todas</option>
          <option  v-for="audiencia in audiencias" :key="audiencia.id" :value="audiencia.id">{{audiencia.nombre}}</option>
        </select>
      </div>
    </div>
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
  watch: {
    audienciaSeleccionada: function(valor){
      if(valor == 0){
        this.url = this.urlBase;
      }
      else {
        this.url = this.urlBase + '?audiencia_id=' + valor;
    }
      this.$nextTick(function() {
        this.$refs.tabla.refresh();
      });
    }
  },
  mounted: function(){
    var v = this;
    axios.get("https://gobiernoabierto.cordoba.gob.ar/api/audiencia-actividad/")
      .then(function(response){
        v.audiencias = response.data.results
      })
  },
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
  data: function() {
    return {
      audiencias: [],
      audienciaSeleccionada: null,
      url: "https://gobiernoabierto.cordoba.gob.ar/api/actividad-publica/",
      urlBase: "https://gobiernoabierto.cordoba.gob.ar/api/actividad-publica/",
      columns: ['titulo', 'descripcion', 'inicia', 'termina', 'nombrelugar', 'lugardir' ],
      options: {
      dateColumn: ['inicia','termina'],
      byColumn: false,
      datepickerOptions: {
        showDropdowns: true
      },
      sortable: ['inicia','termina'],
        headings: {
          titulo: 'Titulo',
          descripcion: 'Descripción',
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
          //function decodeHTMLEntities (str) {
          //  if(str && typeof str === 'string') {
          //    // strip script/html tags
          //    str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
          //    str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
          //  }
          //  return str;
          //}

          var data = response.data.results.map(function(dato){
          moment.locale('es');
          dato.inicia = moment(dato.inicia).format('DD MMM YYYY, HH:mm:ss');
          dato.termina = moment(dato.termina).format('DD MMM YYYY, HH:mm:ss');
          dato.nombrelugar = dato.lugar ? dato.lugar.nombre : '';
          dato.descripcion = dato.descripcion;
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
<style>
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


