<template>
  <div>
    <Header/>
    <div class="columns">
      <div class="column is-three-fifths is-offset-one-fifth has-text-centered">
        <p class="label">Единица измерения: </p>
        <div class="select">
          <select @change="onChange($event)">
            <option v-for="measunit in measunits" :value="measunit.MeasUnit_ID" >{{ measunit.MeasUnitName}}</option>
          </select>
        </div>
        <button class="button" @click="openAddCard()">Добавить запись</button>
      </div>
    </div>
    <div class="columns">
      <div class="column is-8 is-offset-2">
        <div class="box">
          <table class="table is-fullwidth">
            <thead>
              <tr>
                <th>№</th>
                <th>TovarName</th>
                <th>Amount</th>
                <th>TovarID</th>
                <th>Parent</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody v-if="products && products.length > 0">
              <tr v-for="(product, index) in products" v-bind:key="index">
                <td><strong>{{index+1}}</strong></td>
                <td><strong>{{product.TovarName}}</strong></td>
                <td>{{product.Amount}}</td>
                <td>{{product.Tovar_ID}}</td>
                <td>{{product.Parent_ID}}</td>
                <td class="has-text-centered" @click="openEditCard(product.Tovar_ID)"><Fas i="pen"/></td>
                <td class="has-text-centered" @click="openDeleteCard(product.Tovar_ID)"><Fas i="trash-alt"/></td>
              </tr>
            </tbody>
            <tr v-else>
              <td colspan=7 class="has-text-centered"><strong>Данных нет</strong></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <Footer/>
    <Modal ref="modal" @refresh="refreshProducts()"/>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import Fas from '~/components/Fas.vue'
import Modal from '~/components/Modal.vue'

export default {
  components: {
    Header,
    Footer,
    Fas,
    Modal
  },
  data() {
    return {
      measunits: undefined,
      products: undefined,
      measunit: "",
    }
  },
  async asyncData({$axios}){
    return (await $axios.get('/api/measunit')
    .then(async (res) => {
      let measunits = res.data;
      let products = await $axios.get('/api/products/' + measunits[0].MeasUnit_ID)
      return {
        measunits: measunits,
        products: products.data,
        measunit: measunits[0].MeasUnit_ID
      }
    }))
  },
  methods: {
    async onChange(event) {
      this.products = await this.$axios.get('/api/products/' + event.target.value).then((res) => res.data)
      this.measunit = event.target.value
    },
    async openAddCard(event) {
      this.showModal("add", "Добавление записи", "Добавить запись", {measunit: this.measunit})
    },
    async openEditCard(id) {
      let current = await this.$axios.get('/api/products/get/' + id).then((res) => res.data)
      this.showModal("edit", "Изменение записи", "Изменить запись", current)
    },
    async openDeleteCard(id){
      this.showModal("delete", "Удаление записи", "Удалить", {id: id})
    },
    showModal(type, cardName, buttonText, data){
      this.$refs.modal.showModal(type, cardName, buttonText, data)
    },
    async refreshProducts(){
      this.products = await this.$axios.get('/api/products/' + this.measunit).then((res) => res.data)
    }
  },
}
</script>

<style>
body, html{
  background: #fafafa;
}
.label{
  display: inline-block;
  vertical-align: middle;
  line-height: 36px;
  padding-right: 10px;
}

tbody tr:hover, tbody tr:hover strong {
  background-color: #eef6fc;
  color: #1d72aa;
  cursor: pointer;
}
</style>