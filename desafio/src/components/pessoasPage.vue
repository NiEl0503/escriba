<template>
  <section>
    <h1>Cadastro de Pessoas</h1>

      <input type="text" v-model="filtroTexto" placeholder="Filtrar por nome...">
      
    
    <button @click="mostrarModalAdicionar">Adicionar Cliente</button>
<br>
<br>
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
    <tr v-for="pessoa in pessoasFiltradas" :key="pessoa.id">
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
       <form @submit.prevent="modoEdicao ? guardarClienteEditado() : guardarPessoa()">
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
    <div v-if="mostrarModal">
      <h2>Adicionar Novo Cliente</h2>
      <form @submit.prevent="guardarPessoa">
        <label for="nomeModal">Nome:</label>
        <input type="text" id="nomeModal" v-model="novaPessoa.nome" required>
        <p v-if="errors.nome">{{ errors.nome }}</p>

        <label for="cpfModal">CPF:</label>
        <input type="text" id="cpfModal" v-model="novaPessoa.cpf" required>
        <p v-if="errors.cpf">{{ errors.cpf }}</p>

        <label for="dataNascimentoModal">Data de Nascimento:</label>
        <input type="date" id="dataNascimentoModal" v-model="novaPessoa.dataNascimento" required>

        <button type="submit">Adicionar</button>
        <button type="button" @click="fecharModal">Cancelar</button>
      </form>
    </div>

  </section>
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
      filtroTexto: '',
      mostrarModal: false,
      novaPessoa: { nome: '', cpf: '', dataNascimento: '' },
      errors: {},
    };
  },
  mounted() {
    this.obterPessoas();
  },

 computed: {
  pessoasFiltradas() {
    return this.pessoas.filter(pessoa => {
      const nomeEmMinusculo = pessoa.nome.toLowerCase();
      const filtroEmMinusculo = this.filtroTexto.toLowerCase();
      return nomeEmMinusculo.includes(filtroEmMinusculo);
    });
  },
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
      this.pessoa = { ...pessoa, id: pessoa.id };
    },
  mostrarModalAdicionar() {
      this.mostrarModal = true;
    },
    fecharModal() {
      this.mostrarModal = false;
      this.novaPessoa = { nome: '', cpf: '', dataNascimento: '' };
      this.errors = {};
    },
 guardarPessoa() {
      this.errors = {};
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!this.novaPessoa.nome) {
        this.errors.nome = 'Nome obrigatório.';
      }
      if (!cpfRegex.test(this.novaPessoa.cpf)) {
        this.errors.cpf = 'CPF inválido.';
      }

      if (Object.keys(this.errors).length === 0) {
        
        axios.post('http://localhost:3000/pessoas', this.novaPessoa)
          .then(response => {
            console.log('Nova pessoa criada:', response.data);
            this.mostrarModal = false;
            this.obterPessoas();
          })
          .catch(error => {
            console.error('Erro ao adicionar pessoa:', error);
          });
      }
    },
    
guardarClienteEditado() {
  this.errors = {};
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (!this.pessoa.nome) {
    this.errors.nome = 'Nome obrigatório.';
  }
  if (!cpfRegex.test(this.pessoa.cpf)) {
    this.errors.cpf = 'CPF inválido.';
  }

  if (Object.keys(this.errors).length === 0) {
    // Usamos el operador de propagación para crear una copia del objeto antes de enviarlo al servidor
    axios.put(`http://localhost:3000/pessoas/${this.pessoa.id}`, { ...this.pessoa })
      .then(response => {
        console.log('Cliente atualizado:', response.data);
        this.mostrarForm = false;
        this.obterPessoas();
      })
      .catch(error => {
        console.error('Erro ao atualizar cliente:', error);
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