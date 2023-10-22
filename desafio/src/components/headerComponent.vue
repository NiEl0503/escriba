<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/escriba.png" alt="Logo escriba" />
    </div>
    <router-link v-if="mostrarBotaovoltar" to="/" class="return-button">Voltar ao inicio</router-link>
  </header>
</template>

<script>
export default {
  computed: {
   mostrarBotaovoltar() {
      return this.$route.path !== '/' && !this.$route.path.includes('/welcome');
    }
  }
};
</script>

<style scoped lang="scss">
.return-button {
  text-decoration: none;
  color: white;
}
</style>
