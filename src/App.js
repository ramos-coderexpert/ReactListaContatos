import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './assets/cadastro.png';
import { useEffect, useState } from 'react';
import Contato from './components/Contato';

function App() {
  const baseURL = 'https://localhost:7299/Pessoas';

  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(true);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [pessoaSelecionada, setPessoaSelecionada] = useState({
    id: '',
    nome: '',
    idade: '',
    sexo: '',
  });

  const selecionarPessoa = (pessoa, opcao) => {
    setPessoaSelecionada(pessoa);
    opcao === 'Editar' ? abrirFecharModalEditar() : abrirFecharModalExcluir();
  };

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  };

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setPessoaSelecionada({ ...pessoaSelecionada, [name]: value });
  };

  const pedidoGet = async () => {
    await axios
      .get(baseURL)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const pedidoPost = async () => {
    delete pessoaSelecionada.pessoaId;
    pessoaSelecionada.idade = parseInt(pessoaSelecionada.idade);
    await axios
      .post(baseURL, pessoaSelecionada)
      .then(response => {
        setData(data.concat(response.data));
        setUpdateData(true);
        abrirFecharModalIncluir();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const pedidoPut = async () => {
    pessoaSelecionada.idade = parseInt(pessoaSelecionada.idade);
    await axios
      .put(baseURL + '/' + pessoaSelecionada.pessoaId, pessoaSelecionada)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        dadosAuxiliar.map(pessoa => {
          if (pessoa.pessoaId === pessoaSelecionada.pessoaId) {
            pessoa.nome = resposta.nome;
            pessoa.idade = resposta.idade;
            pessoa.sexo = resposta.sexo;
          }
        });
        setUpdateData(true);
        abrirFecharModalEditar();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const pedidoDelete = async () => {
    await axios
      .delete(baseURL + '/' + pessoaSelecionada.pessoaId)
      .then(response => {
        //prettier-ignore
        setData(data.filter(pessoaSelecionada => pessoaSelecionada.pessoaId !== response.data));
        setUpdateData(true);
        abrirFecharModalExcluir();
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (updateData) {
      pedidoGet();
      setUpdateData(false);
    }
  }, [updateData]);

  return (
    <div className="pessoa-container">
      <br />
      <h3>Cadastro de Pessoas</h3>
      <header>
        <img src={logoCadastro} alt="Cadastro" />
        <button
          className="btn btn-success"
          onClick={() => abrirFecharModalIncluir()}
        >
          Incluir Nova Pessoa
        </button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Sexo</th>
            <th>Contatos</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map(pessoa => (
            <tr key={pessoa.pessoaId}>
              <td>{pessoa.pessoaId}</td>
              <td>{pessoa.nome}</td>
              <td>{pessoa.idade}</td>
              <td>{pessoa.sexo}</td>
              <td>
                <Contato key={pessoa.pessoaId} pessoa={pessoa}></Contato>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => selecionarPessoa(pessoa, 'Editar')}
                >
                  Editar
                </button>{' '}
                <button
                  className="btn btn-danger"
                  onClick={() => selecionarPessoa(pessoa, 'Excluir')}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Pessoa</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nome"
              onChange={handleChange}
            />
            <br />
            <label>Idade: </label>
            <br />
            <input
              type="number"
              className="form-control"
              name="idade"
              onChange={handleChange}
            />
            <br />
            <label>Sexo: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="sexo"
              onChange={handleChange}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPost()}>
            Incluir
          </button>
          {'   '}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalIncluir()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Pessoa</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID:</label>
            <input
              type="text"
              className="form-control"
              readOnly
              value={pessoaSelecionada && pessoaSelecionada.pessoaId}
            />
            <br />
            <label>Nome:</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nome"
              onChange={handleChange}
              value={pessoaSelecionada && pessoaSelecionada.nome}
            />
            <br />
            <label>Idade:</label>
            <br />
            <input
              type="number"
              className="form-control"
              name="idade"
              onChange={handleChange}
              value={pessoaSelecionada && pessoaSelecionada.idade}
            />
            <br />
            <label>Sexo:</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="sexo"
              onChange={handleChange}
              value={pessoaSelecionada && pessoaSelecionada.sexo}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => pedidoPut()}>
            Editar
          </button>
          {'  '}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalEditar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão desta pessoa:{' '}
          {pessoaSelecionada && pessoaSelecionada.nome}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => pedidoDelete()}>
            Sim
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => abrirFecharModalExcluir()}
          >
            Não
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
