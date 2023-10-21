<template>
  <section class="welcome">
    <h1>Bem vindo(a)</h1>
    <p>Selecione uma seção para começar:</p>
    <router-link to="/pessoasPage">Pessoas</router-link><br>
    <router-link to="/produtosPage">Produtos</router-link><br>
    <router-link to="/pedidosPage">Pedidos</router-link>
  </section>
</template>

<style lang="scss">
$backgroundColor: #0f7;
$welcomeMarginTop: 50px;
$linkMargin: 10px;
$linkFontSize: 18px;
$color: #04534f;

body {
  background-color: $backgroundColor;
}

.welcome {
  text-align: center;
  margin-top: $welcomeMarginTop;
}

router-link {
  margin: $linkMargin;
  font-size: $linkFontSize;
  display: block;
 
}

a {

  color: $color;
  text-decoration: none;
}
</style>

