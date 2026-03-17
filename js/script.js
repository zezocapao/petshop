/*
    Arquivo: script.js
    Objetivo: adicionar dinamismo ao sistema web do petshop.
    Funcionalidades implementadas:
    1. Mensagem automática de boas-vindas com data atual.
    2. Definição de data mínima no campo de agendamento.
    3. Máscara simples para CPF e telefone.
    4. Validação do formulário.
    5. Exibição de resumo do agendamento após envio.
*/

// Executa o código somente após o carregamento completo da página.
document.addEventListener('DOMContentLoaded', function () {
    exibirMensagemDoDia();
    configurarDataMinima();
    aplicarMascaraCPF();
    aplicarMascaraTelefone();
    configurarFormulario();
});

// Exibe uma saudação com base no horário atual e mostra a data por extenso.
function exibirMensagemDoDia() {
    const mensagem = document.getElementById('mensagemBoasVindas');
    const dataAtual = document.getElementById('dataAtual');
    const agora = new Date();
    const hora = agora.getHours();

    let saudacao = 'Bem-vindo ao PetShop Cão Feliz!';

    if (hora < 12) {
        saudacao = 'Bom dia! Cuide do seu pet com carinho e segurança.';
    } else if (hora < 18) {
        saudacao = 'Boa tarde! Agende hoje mesmo o serviço do seu pet.';
    } else {
        saudacao = 'Boa noite! Planeje o próximo atendimento do seu pet.';
    }

    mensagem.textContent = saudacao;

    const opcoesData = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    dataAtual.textContent = `Data atual: ${agora.toLocaleDateString('pt-BR', opcoesData)}`;
}

// Impede que o usuário escolha datas passadas para o agendamento.
function configurarDataMinima() {
    const campoData = document.getElementById('dataAgendamento');
    const hoje = new Date().toISOString().split('T')[0];
    campoData.min = hoje;
}

// Aplica uma máscara simples no campo CPF no formato 000.000.000-00.
function aplicarMascaraCPF() {
    const campoCPF = document.getElementById('cpf');

    campoCPF.addEventListener('input', function () {
        let valor = campoCPF.value.replace(/\D/g, '');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        campoCPF.value = valor;
    });
}

// Aplica máscara de telefone no formato (00) 00000-0000.
function aplicarMascaraTelefone() {
    const campoTelefone = document.getElementById('telefone');

    campoTelefone.addEventListener('input', function () {
        let valor = campoTelefone.value.replace(/\D/g, '');
        valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
        valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
        campoTelefone.value = valor;
    });
}

// Configura o comportamento do formulário: validação, resumo e limpeza da mensagem ao resetar.
function configurarFormulario() {
    const formulario = document.getElementById('formAgendamento');
    const resultado = document.getElementById('resultadoAgendamento');

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        evento.stopPropagation();

        const dataValida = validarData(formulario);
        const horaValida = validarHora(formulario);

        if (!formulario.checkValidity() || !dataValida || !horaValida) {
            formulario.classList.add('was-validated');
            return;
        }

        formulario.classList.add('was-validated');

        const nomeCliente = document.getElementById('nomeCliente').value;
        const nomePet = document.getElementById('nomePet').value;
        const servico = document.getElementById('servico').value;
        const atendimento = document.querySelector('input[name="atendimento"]:checked').value;
        const data = document.getElementById('dataAgendamento').value;
        const hora = document.getElementById('horaAgendamento').value;

        const dataFormatada = new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR');

        resultado.classList.remove('d-none');
        resultado.textContent = `Agendamento realizado com sucesso!\n\nCliente: ${nomeCliente}\nPet: ${nomePet}\nServiço: ${servico}\nAtendimento: ${atendimento}\nData: ${dataFormatada}\nHorário: ${hora}`;

        formulario.reset();
        formulario.classList.remove('was-validated');
        configurarDataMinima();
    });

    formulario.addEventListener('reset', function () {
        resultado.classList.add('d-none');
        resultado.textContent = '';
        formulario.classList.remove('was-validated');
    });
}

// Verifica se a data escolhida não é anterior à data atual.
function validarData(formulario) {
    const campoData = document.getElementById('dataAgendamento');
    const hoje = new Date().toISOString().split('T')[0];

    if (campoData.value < hoje) {
        campoData.classList.add('is-invalid');
        return false;
    }

    campoData.classList.remove('is-invalid');
    return true;
}

// Verifica se o horário está dentro do período de atendimento.
function validarHora(formulario) {
    const campoHora = document.getElementById('horaAgendamento');
    const horaSelecionada = campoHora.value;

    if (horaSelecionada < '08:00' || horaSelecionada > '18:00') {
        campoHora.classList.add('is-invalid');
        return false;
    }

    campoHora.classList.remove('is-invalid');
    return true;
}
