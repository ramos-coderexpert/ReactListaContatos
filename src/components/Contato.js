import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export default function Contato({ pessoa }) {
  const { pessoaId, nome } = pessoa;
  const contatosURL = 'https://localhost:7299/Contatos';

  const [dataContato, setDataContato] = useState([]);
  const [updateDataContato, setUpdateDataContato] = useState(true);
  const [modalContatos, setModalContatos] = useState(false);
  const [modalContatoIncluir, setModalContatoIncluir] = useState(false);
  const [modalContatoEditar, setModalContatoEditar] = useState(false);
  const [modalContatoExcluir, setModalContatoExcluir] = useState(false);

  const [contatoSelecionado, setContatoSelecionado] = useState({
    id: '',
    nome: '',
    conteudo: '',
  });

  const selecionarContato = (pessoa, opcao) => {
    setContatoSelecionado(pessoa);
    opcao === 'Editar'
      ? abrirFecharModalContatoEditar()
      : abrirFecharModalContatoExcluir();
  };

  const abrirFecharModalContatos = () => {
    setModalContatos(!modalContatos);
  };

  const abrirFecharModalContatoIncluir = () => {
    setModalContatoIncluir(!modalContatoIncluir);
  };

  const abrirFecharModalContatoEditar = () => {
    setModalContatoEditar(!modalContatoEditar);
  };

  const abrirFecharModalContatoExcluir = () => {
    setModalContatoExcluir(!modalContatoExcluir);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setContatoSelecionado({ ...contatoSelecionado, [name]: value });
  };

  const pedidoGetContatos = async () => {
    await axios
      .get(contatosURL + '/' + pessoaId)
      .then(response => {
        setDataContato(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const pedidoPostContato = async () => {
    delete contatoSelecionado.contatoId;
    contatoSelecionado.pessoaId = pessoaId;
    await axios
      .post(contatosURL, contatoSelecionado)
      .then(response => {
        setDataContato(dataContato.concat(response.data));
        setUpdateDataContato(true);
        abrirFecharModalContatoIncluir();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const pedidoPutContato = async () => {
    await axios
      .put(contatosURL + '/' + contatoSelecionado.contatoId, contatoSelecionado)
      .then(response => {
        var resposta = response.data;
        var dadosAuxiliar = dataContato;
        dadosAuxiliar.map(contato => {
          if (contato.pessoaId === contatoSelecionado.contatoId) {
            contato.nome = resposta.nome;
            contato.conteudo = resposta.conteudo;
          }
        });
        setUpdateDataContato(true);
        abrirFecharModalContatoEditar();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const pedidoDeleteContato = async () => {
    await axios
      .delete(contatosURL + '/' + contatoSelecionado.contatoId)
      .then(response => {
        //prettier-ignore
        setDataContato(dataContato.filter(contatoSelecionado => contatoSelecionado.contatoId !== response.data));
        setUpdateDataContato(true);
        abrirFecharModalContatoExcluir();
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (updateDataContato) {
      pedidoGetContatos();
      setUpdateDataContato(false);
    }
  }, [updateDataContato]);

  return (
    <div>
      <button
        className="btn btn-secondary"
        onClick={() => abrirFecharModalContatos()}
      >
        Contatos
      </button>

      <Modal fullscreen={true} isOpen={modalContatos}>
        <ModalHeader>Lista Contatos do(a): {nome}</ModalHeader>

        <ModalBody>
          <div className="form-group">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nome</th>
                  <th>Conteudo</th>
                  <th>Operação</th>
                </tr>
              </thead>
              <tbody>
                {dataContato.map(contato => (
                  <tr key={contato.contatoId}>
                    <td>{contato.contatoId}</td>
                    <td>{contato.nome}</td>
                    <td>{contato.conteudo}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => selecionarContato(contato, 'Editar')}
                      >
                        Editar
                      </button>{' '}
                      <button
                        className="btn btn-danger"
                        onClick={() => selecionarContato(contato, 'Excluir')}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ModalBody>

        <ModalFooter>
          {/* onClick={() => pedidoPost()} */}
          <button
            className="btn btn-primary"
            onClick={() => abrirFecharModalContatoIncluir()}
          >
            Incluir
          </button>
          {'   '}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalContatos()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalContatoIncluir}>
        <ModalHeader>Incluir Contato</ModalHeader>
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
            <label>Conteudo: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="conteudo"
              onChange={handleChange}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-primary"
            onClick={() => pedidoPostContato()}
          >
            Incluir
          </button>
          {'   '}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalContatoIncluir()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalContatoEditar}>
        <ModalHeader>Editar Contato</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID:</label>
            <input
              type="text"
              className="form-control"
              readOnly
              value={contatoSelecionado && contatoSelecionado.contatoId}
            />
            <br />
            <label>Nome:</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="nome"
              onChange={handleChange}
              value={contatoSelecionado && contatoSelecionado.nome}
            />
            <br />
            <label>Conteudo:</label>
            <br />
            <input
              type="text"
              className="form-control"
              name="conteudo"
              onChange={handleChange}
              value={contatoSelecionado && contatoSelecionado.conteudo}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-primary"
            onClick={() => pedidoPutContato()}
          >
            Editar
          </button>
          {'  '}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalContatoEditar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalContatoExcluir}>
        <ModalBody>
          Confirma a exclusão deste contato:{' '}
          {contatoSelecionado && contatoSelecionado.nome}?
        </ModalBody>
        <ModalFooter>
          <button
            className="btn btn-danger"
            onClick={() => pedidoDeleteContato()}
          >
            Sim
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => abrirFecharModalContatoExcluir()}
          >
            Não
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
