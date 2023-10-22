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

.header {
  width: 100%;
  margin: 0 auto;
  padding: 10px 0;
  background-color: #0f7;
}

.logo img {
  width: 150px;
  height: auto;
}
.return-button {
  text-decoration: none;
  color: white;
}
</style>
