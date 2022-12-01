export default class Tarefa {
    constructor(id, titulo, descricao, data, nivel, status, responsavel) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.data = data;
        this.nivel = nivel;
        this.status = status;
        this.responsavel = responsavel;
    }

    AlternarStatus() {
        this.status = !this.status;
    }
}