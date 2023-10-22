<template>
  <section>
  <Header />
    <h1>Cadastro de Produtos</h1>

    <button @click="mostrarModalAdicionar">Adicionar Produto</button>
<br>
<br>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Descrição</th>
          <th>Valor Unitário</th>
          <th>Editar</th>
          <th>Excluir</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="produto in produtos" :key="produto.id">
          <td>{{ produto.id }}</td>
          <td>{{ produto.descricao }}</td>
          <td>{{ produto.valoUnitario }}</td>
          <td>
            <button @click="editarProduto(produto)">Editar</button>
          </td>
          <td>
            <button @click="eliminarProduto(produto.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="mostrarForm">
      <h2>{{ modoEdicao ? 'Editar Produto' : 'Adicionar Produto' }}</h2>
      <form @submit.prevent="guardarProduto">
        <label for="descricao">Descrição:</label>
        <input type="text" id="descricao" v-model="produto.descricao" required><br>

        <label for="valorUnitario">Valor Unitário:</label>
        <input type="number" id="valoUnitario" v-model="produto.valoUnitario" required><br>

        <button type="submit">{{ modoEdicao ? 'Salvar' : 'Adicionar' }}</button>
        <button type="button" @click="cancelarFormulario">Cancelar</button>
      </form>
    </div>
  <div v-if="mostrarModal" class="modal">
  <div class="modal-content">
    <h2>{{ modoEdicao ? 'Editar Produto' : 'Adicionar Produto' }}</h2>
    <form @submit.prevent="guardarProduto">
      <label for="descricao">Descrição:</label>
      <input type="text" id="descricao" v-model="novoProduto.descricao" required><br>

      <label for="valorUnitario">Valor Unitário:</label>
      <input type="number" id="valorUnitario" v-model="novoProduto.valoUnitario" required><br>

      <button type="submit">{{ modoEdicao ? 'Salvar' : 'Adicionar' }}</button>
      <button type="button" @click="fecharModal">Cancelar</button>
    </form>
  </div>
</div>


  </section>
</template>

<script>
import axios from 'axios';
import Header from './headerComponent';

export default {
  components: {
    Header
  },
  data() {
    return {
      produtos: [],
      produto: { descricao: '', valorUnitario: 0 },
      mostrarForm: false,
      modoEdicao: false,
      filtroTexto: '',
      mostrarModal: false,
      errors: {},
      novoProduto: { descricao: '', valorUnitario: 0 },
    };
  },
  mounted() {
    this.obterProdutos();
  },

  computed: {
    produtosFiltrados() {
      return this.produtos.filter(produto => {
        const descricaoMinusculo = produto.descricao.toLowerCase();
        const filtroEmMinusculo = this.filtroTexto.toLowerCase();
        return descricaoMinusculo.includes(filtroEmMinusculo);
      });
    },
  },

  methods: {
    obterProdutos() {
      axios.get('http://localhost:3000/produtos')
        .then(response => {
          this.produtos = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    mostrarFormulario() {
      this.mostrarForm = true;
      this.modoEdicao = false;
      this.produto = { descricao: '', valoUnitario: 0 };
    },
    editarProduto(produto) {
      this.mostrarForm = true;
      this.modoEdicao = true;
      this.produto = { ...produto, id: produto.id };
    },
    mostrarModalAdicionar() {
      this.mostrarModal = true;
    },
    fecharModal() {
      this.mostrarModal = false;
      this.produto = { descricao: '', valoUnitario: 0 };
      this.errors = {};
    },
guardarProduto() {
  this.errors = {};

  if (Object.keys(this.errors).length === 0) {
    if (this.modoEdicao) {
      axios.put(`http://localhost:3000/produtos/${this.produto.id}`, { ...this.produto })
        .then(response => {
          console.log('Produto atualizado:', response.data);
          this.mostrarForm = false;
          this.obterProdutos();
        })
        .catch(error => {
          console.error('Erro ao atualizar produto:', error);
        });
    } else {

      axios.post('http://localhost:3000/produtos', this.novoProduto)
        .then(response => {
          console.log('Novo produto criado:', response.data);
          this.mostrarModal = false;
          this.obterProdutos();
        })
        .catch(error => {
          console.error('Erro ao adicionar produto:', error);
        });
    }
  }
},

    eliminarProduto(id) {
      axios.delete(`http://localhost:3000/produtos/${id}`)
        .then(response => {
          console.log('Produto eliminado:', response.data);
          this.obterProdutos();
        })
        .catch(error => {
          console.error('Erro ao eliminar produto:', error);
        });
    },
    cancelarFormulario() {
      this.mostrarForm = false;
      this.produto = { descricao: '', valoUnitario: 0 };
    },
  },
};
</script>

<style scoped lang="scss">
$color-lineas: white;
$color-hover: #6ef993;
$color-fondo-modal: rgba(0, 0, 0, 0.5);
$color-fondo-contenido-modal: #fff;

table {
  width: 100%;
  border-collapse: collapse;
  tr {
    border-bottom: 1px solid $color-lineas;
    &:last-child {
      border-bottom: none;
    }
  }

    &:hover {
      background-color: $color-hover;
    }
  
  th, td {
    border: 1px solid $color-lineas;
  }
}

.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: $color-fondo-modal;
  z-index: 999;
  
  .modal-content {
    background: $color-fondo-contenido-modal;
    width: 80%;
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
}</style>

