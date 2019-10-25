<template>
  <transition name="slide-fade">
    <article class="message" :class="{'is-success': !error, 'is-danger': error}" v-if="show">
      <div class="message-body">
        {{text}}
      </div>
    </article>
  </transition>
</template>

<script>
export default {
  data() {
    return{
      show: false,
      text: "",
      error: false,
      timeout: undefined
    }
  },
  methods: {
    showMessage(text, error) {
      this.text = text
      this.error = error
      this.show = true
      let self = this
      if(this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(function() {
        self.show = false
      }, 3000)
    }
  }
}
</script>

<style>
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to{
    transform: translateX(10px);
    opacity: 0;
  }
  .message{
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 999;
  }
</style>