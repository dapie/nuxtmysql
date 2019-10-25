<template>
  <div>
    <div class="modal" :class="{'is-active': active}">
      <div class="modal-background" @click="active = !active"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{cardName}}</p>
        </header>
        <section class="modal-card-body" v-if="type == 'delete'">
          <p class="modal-card">Вы уверены ?</p>
        </section>
        <section class="modal-card-body" v-else>
          <div class="field">
            <label class="label">Tovar_ID</label>
            <div class="control">
              <input class="input" type="text" placeholder="Идентификатор" v-model="tovarID" :disabled="type == 'edit'">
            </div>
          </div>
          <div class="field">
            <label class="label">TovarName</label>
            <div class="control">
              <input class="input" type="text" placeholder="Название товара" v-model="tovarName">
            </div>
          </div>
          <div class="field">
            <label class="label">Amount</label>
            <div class="control">
              <input class="input" type="text" placeholder="Количество" v-model="amount">
            </div>
          </div>
          <div class="field" v-if="measunits">
            <label class="label">MeasUnit_ID ({{measunits.find(m => m.MeasUnit_ID == measunit).MeasUnitName}})</label>
            <div class="control" v-if="type == 'add'">
              <input class="input" type="text" :value="measunit" disabled>
            </div>
            <div class="control" v-else>
              <div class="select">
                <select v-model="measunit">
                  <option v-for="measunit in measunits" :value="measunit.MeasUnit_ID" >{{"("+measunit.MeasUnit_ID+") " + measunit.MeasUnitName}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Parent_ID</label>
            <div class="control">
              <div class="select">
                <select v-model="selectedParent">
                 <option v-for="parent in parents" :value="parent.Tovar_ID" >{{"("+parent.Tovar_ID+") "+parent.TovarName}}</option>
                </select>
              </div>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click="action()" :class="[type != 'delete' ? 'is-success' : 'is-danger']">{{buttonText}}</button>
          <button class="button" @click="active = !active">Отменить</button>
        </footer>
      </div>
    </div>
    <Message ref="message"/>
  </div>
</template>

<script>
  import Message from '~/components/Message.vue'

  export default {
    components: {
      Message,
    },
    data() {
      return{
        active: false,
        selectedParent: "",
        tovarID: "",
        tovarName: "",
        amount: "",
        measunit: "",
        cardName: "",
        buttonText: "",
        parents: undefined,
        measunits: undefined,
        type: ""
      }
    },
    methods: {
      async showModal(type, cardName, buttonText, data){
        this.cardName = cardName
        this.buttonText = buttonText
        this.parents = await this.$axios.get('/api/parents').then((res) => res.data)
        this.type = type
        if(type == "add"){
          this.tovarID = ""
          this.tovarName = ""
          this.amount = ""
          this.measunit = data.measunit
          this.selectedParent = this.parents[0].Tovar_ID
        } else if (type == "edit"){
          this.tovarID = data['Tovar_ID']
          this.tovarName = data['TovarName']
          this.amount = data['Amount']
          this.measunit = data['MeasUnit_ID']
          this.selectedParent = this.parents.find(m => m.Tovar_ID == data['Parent_ID']).Tovar_ID
        } else if (type == "delete"){
          this.tovarID = data.id
        }
        this.measunits = await this.$axios.get('/api/measunit').then((res) => res.data)
        this.active = true
      },

      async action() {
        if (!this.checkFields) return;
        let data = {
          tovarID: this.tovarID,
          tovarName: this.tovarName,
          amount: this.amount,
          measUnitID: this.measunit,
          parentID: this.selectedParent
        }
        let res = {error: ""}
        if(this.type == "add"){
          res = await this.$axios.post('/api/products/add', data).then((res) => res.data)
        } else if (this.type == "edit"){
          res = await this.$axios.post('/api/products/edit', data).then((res) => res.data)
        } else if (this.type == "delete"){
          res = await this.$axios.post('/api/products/delete', {id: this.tovarID}).then((res) => res.data)
        }
        if(res.error){
          this.showMessage(res.error.sqlMessage, true)
          return;
        } else {
          this.showMessage("Действие выполнено успешно")
          this.active = false
        }
        this.$emit('refresh')
      },
      checkFields(){
        if(this.tovarID == "" || this.tovarName == "" || this.amount == ""){
          this.showMessage("Заполните все поля", true)
          return false
        }
        return true
      },
      showMessage(text, error = false){
        this.$refs.message.showMessage(text, error)
      },
    },
  }
</script>