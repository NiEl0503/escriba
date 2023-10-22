<template>
  <section>
    <h1>Cadastro de Pedidos</h1>

    <input type="text" v-model="filtroTexto" placeholder="Filtrar por cliente...">

    <button @click="mostrarModalAdicionar">Adicionar Pedido</button>
 <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Data de Emissão</th>
          <th>Valor Total</th>
          <th>Editar</th>
          <th>Excluir</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pedido in pedidosFiltrados" :key="pedido.id">
          <td>{{ pedido.id }}</td>
          <td>{{ pedido.cliente ? pedido.cliente.nome : 'Cliente não disponível' }}</td>
          <td>{{ pedido.dataEmissao }}</td>
          <td>{{ pedido.valorTotal }}</td>
          <td>
            <button @click="editarPedido(pedido)">Editar</button>
          </td>
          <td>
            <button @click="excluirPedido(id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="mostrarModal" class="modal">
      <div class="modal-content">
        <h2>{{ modoEdicao ? 'Editar Pedido' : 'Adicionar Pedido' }}</h2>
        <form @submit.prevent="modoEdicao ? salvarPedidoEditado() : adicionarPedido()">
          <label for="cliente">Cliente:</label>
          <input type="text" id="cliente" v-model="novoPedido.clienteNome" required>

          <label for="dataEmissao">Data de Emissão:</label>
          <input type="date" id="dataEmissao" v-model="novoPedido.dataEmissao" required>

          <label for="produto">Produto:</label>
          <select v-model="novoPedido.produtoSelecionado" required>
            <option value="" disabled selected>Selecione um produto</option>
            <option v-for="produto in produtos" :key="produto.id" :value="produto.id">{{ produto.descricao }}</option>
          </select>

          <label for="quantidade">Quantidade:</label>
          <input type="number" v-model="novoPedido.quantidade" required>

          <button type="button" @click="agregarItem()">Agregar Item</button>

          <button type="submit">{{ modoEdicao ? 'Salvar' : 'Adicionar' }}</button>
          <button type="button" @click="fecharModal">Cancelar</button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      pedidos: [],
      pessoas: [],
      produtos: [],
      filtroTexto: '',
      mostrarModal: false,
      modoEdicao: false,
      novoPedido: {
        clienteNome: null,
        dataEmissao: '',
        itens: [],
        productoSelecionado: null,
      quantidade: 0,
      },
    };
  },
  mounted() {
    this.obterPedidos();
    this.obterClientes();
    this.obterProdutos();
  },
  computed: {
    pedidosFiltrados() {
      return this.pedidos.filter(pedido => {
        const nomeCliente = pedido.cliente ? pedido.cliente.nome.toLowerCase() : '';
        const filtro = this.filtroTexto.toLowerCase();
        return nomeCliente.includes(filtro);
      });
    },
  },

  methods: {
    obterPedidos() {
      axios.get('http://localhost:3000/pedidos')
        .then(response => {
          this.pedidos = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    obterClientes() {
      axios.get('http://localhost:3000/pessoas')
        .then(response => {
          this.pessoas = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    obterProdutos() {
      axios.get('http://localhost:3000/produtos')
        .then(response => {
          this.produtos = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    mostrarModalAdicionar() {
  this.novoPedido = {
    clienteNome: null,
    dataEmissao: '',
    itens: [],
  };
  this.mostrarModal = true;
},
    fecharModal() {
      this.mostrarModal = false;
      this.novoPedido = {
        clienteNome: '',
        dataEmissao: '',
        itens: [],
      };
    },
adicionarPedido() {
  if (this.novoPedido.clienteNome && this.novoPedido.dataEmissao && this.novoPedido.itens.length > 0) {
    const novoPedido = {
      cliente: {
        nome: this.novoPedido.clienteNome,
      },
      dataEmissao: this.novoPedido.dataEmissao,
      itens: this.novoPedido.itens,
    };

    axios.post('http://localhost:3000/pedidos', novoPedido)
      .then(response => {
        console.log('Novo pedido criado:', response.data);
        this.mostrarModal = false;
        this.obterPedidos();
      })
      .catch(error => {
        console.error('Erro ao adicionar pedido:', error);
      });
  } else {
    console.error('Preencha todos os campos antes de adicionar o pedido');
  }
},
    agregarItem() {
      if (this.novoPedido.produtoSelecionado && this.novoPedido.quantidade > 0) {
        const produtoSelecionado = this.produtos.find(produto => produto.id === this.novoPedido.produtoSelecionado);
        if (produtoSelecionado) {
          const novoItem = {
            produto: {
              id: produtoSelecionado.id,
              descricao: produtoSelecionado.descricao,
            },
            valor: produtoSelecionado.valor,
            quantidade: this.novoPedido.quantidade,
            subtotal: produtoSelecionado.valor * this.novoPedido.quantidade,
          };
          this.novoPedido.itens.push(novoItem);
          this.novoPedido.produtoSelecionado = null;
          this.novoPedido.quantidade = 0;
        } else {
          console.error('Produto não encontrado');
        }
      } else {
        console.error('Selecione um produto e especifique uma quantidade válida.');
      }
},
    editarPedido(pedido) {
      this.novoPedido = { ...pedido };
      this.mostrarModal = true;
      this.modoEdicao = true;
    },
    salvarPedidoEditado() {
      axios.put(`http://localhost:3000/pedidos/${this.novoPedido.id}`, this.novoPedido)
        .then(response => {
          console.log('Pedido atualizado:', response.data);
          this.mostrarModal = false;
          this.obterPedidos();
        })
        .catch(error => {
          console.error('Erro ao atualizar pedido:', error);
        });
    },
    excluirPedido(id) {
      axios.delete(`http://localhost:3000/pedidos/${id}`)
        .then(response => {
          console.log('Pedido excluído:', response.data);
          this.obterPedidos();
        })
        .catch(error => {
          console.error('Erro ao excluir pedido:', error);
        });
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
