<template>
  <div>
    <h1>Cadastro de Pessoas</h1>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>CPF</th>
          <th>Data de Nascimento</th>
          <th>Editar</th>
          <th>Excluir</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pessoa in pessoas" :key="pessoa.id">
          <td>{{ pessoa.id }}</td>
          <td>{{ pessoa.nome }}</td>
          <td>{{ pessoa.cpf }}</td>
          <td>{{ pessoa.dataNascimento }}</td>
          <td>
            <button @click="editarPessoa(pessoa)">Editar</button>
          </td>
          <td>
            <button @click="eliminarPessoa(pessoa.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="mostrarForm">
      <h2>{{ modoEdicao ? 'Editar Pessoa' : 'Adicionar Pessoa' }}</h2>
      <form @submit.prevent="guardarPessoa">
        <label for="nome">Nome:</label>
        <input type="text" id="nome" v-model="pessoa.nome" required><br>

        <label for="cpf">CPF:</label>
        <input type="text" id="cpf" v-model="pessoa.cpf" required><br>

        <label for="dataNascimento">Data de Nascimento:</label>
        <input type="date" id="dataNascimento" v-model="pessoa.dataNascimento" required><br>

        <button type="submit">{{ modoEdicao ? 'Salvar' : 'Adicionar' }}</button>
        <button type="button" @click="cancelarFormulario">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      pessoas: [],
      pessoa: { nome: '', cpf: '', dataNascimento: '' },
      mostrarForm: false,
      modoEdicao: false,
    };
  },
  mounted() {
    this.obterPessoas();
  },
  methods: {
    obterPessoas() {
      axios.get('http://localhost:3000/pessoas')
        .then(response => {
          this.pessoas = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    mostrarFormulario() {
      this.mostrarForm = true;
      this.modoEdicao = false;
      this.pessoa = { nome: '', cpf: '', dataNascimento: '' };
    },
    editarPessoa(pessoa) {
      this.mostrarForm = true;
      this.modoEdicao = true;
      this.pessoa = { ...pessoa };
    },
    guardarPessoa() {
      if (this.modoEdicao) {
        axios.put(`http://localhost:3000/pessoas/${this.pessoa.id}`, this.pessoa)
          .then(response => {
            console.log('Pessoa atualizada:', response.data);
            this.mostrarForm = false;
            this.obterPessoas();
          })
          .catch(error => {
            console.error('Erro ao atualizar a pessoa:', error);
          });
      } else {
        axios.post('http://localhost:3000/pessoas', this.pessoa)
          .then(response => {
            console.log('Nova pessoa criada:', response.data);
            this.mostrarForm = false;
            this.obterPessoas();
          })
          .catch(error => {
            console.error('Erro ao adicionar pessoa:', error);
          });
      }
    },
    eliminarPessoa(id) {
      axios.delete(`http://localhost:3000/pessoas/${id}`)
        .then(response => {
          console.log('Pessoa eliminada:', response.data);
          this.obterPessoas();
        })
        .catch(error => {
          console.error('Erro ao eliminar pessoa:', error);
        });
    },
    cancelarFormulario() {
      this.mostrarForm = false;
      this.pessoa = { nome: '', cpf: '', dataNascimento: '' };
    },
  },
};
</script>

<style scoped lang="scss">
$color-lineas: white;
$color-hover: #6ef993;

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
</style>