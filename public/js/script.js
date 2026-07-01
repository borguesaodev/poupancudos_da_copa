const API_URL = 'http://localhost:3000/api/apostas';

// Elementos DOM
const modal = document.getElementById('aposta-modal');
const form = document.getElementById('aposta-form');
const tbody = document.getElementById('apostas-tbody');

const editIdInput = document.getElementById('edit-id');
const gameTitleInput = document.getElementById('game-title');
const labelTime1 = document.getElementById('label-time1');
const labelTime2 = document.getElementById('label-time2');

const nomeInput = document.getElementById('nome');
const idadeInput = document.getElementById('idade');
const cpfInput = document.getElementById('cpf');
const telefoneInput = document.getElementById('telefone');
const placar1Input = document.getElementById('placar1');
const placar2Input = document.getElementById('placar2');
const submitBtn = document.getElementById('submit-btn');

// Carregar apostas ao iniciar
document.addEventListener('DOMContentLoaded', fetchApostas);

async function fetchApostas() {
    try {
        const response = await fetch('http://localhost:3000/api/apostas');
        const apostas = await response.json();
        renderTable(apostas);
    } catch (error) {
        console.error('Erro ao buscar apostas:', error);
    }
}

function renderTable(apostas) {
    tbody.innerHTML = '';
    if (apostas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888;">Nenhuma aposta cadastrada.</td></tr>`;
        return;
    }
    
    apostas.forEach(aposta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${aposta.id}</td>
            <td><strong>${aposta.participante}</strong></td>
            <td>${aposta.jogo}</td>
            <td><span class="vs-text" style="font-size:12px; padding:2px 6px;">${aposta.palpite}</span></td>
            <td><button class="btn-action btn-edit" onclick="editAposta(${aposta.id}, '${aposta.participante}', '${aposta.jogo}', '${aposta.palpite}')">Editar</button></td>
            <td><button class="btn-action btn-delete" onclick="deleteAposta(${aposta.id})">Deletar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function openApostaModal(game, team1, team2) {
    form.reset();
    editIdInput.value = '';
    gameTitleInput.value = game;
    labelTime1.textContent = team1;
    labelTime2.textContent = team2;
    submitBtn.textContent = 'Apostar';
    modal.style.display = 'flex';
}

function closeApostaModal() {
    modal.style.display = 'none';
}

// Submeter formulário (Criar ou Atualizar)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = editIdInput.value;
    const jogo = gameTitleInput.value;
    const participante = nomeInput.value;
    const palpite = `${labelTime1.textContent} ${placar1Input.value} x ${placar2Input.value} ${labelTime2.textContent}`;

    const data = { jogo, participante, palpite };

    try {
        if (id) {
            // Atualizar (PUT)
            await fetch(`${'http://localhost:3000/api/apostas'}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } {
            // Criar (POST)
            if (!id) {
                await fetch('http://localhost:3000/api/apostas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
        }
        closeApostaModal();
        fetchApostas();
    } catch (error) {
        console.error('Erro ao salvar aposta:', error);
    }
});

// Preparar edição
function editAposta(id, participante, jogo, palpite) {
    openApostaModal(jogo, 'Time A', 'Time B'); // Fallback temporário de nomes
    
    // Tenta quebrar o palpite existente (Ex: "Brasil 2 x 1 França")
    const regex = /(.+)\s+(\d+)\s+x\s+(\d+)\s+(.+)/;
    const match = palpite.match(regex);
    
    if (match) {
        labelTime1.textContent = match[1].trim();
        placar1Input.value = match[2];
        placar2Input.value = match[3];
        labelTime2.textContent = match[4].trim();
    }

    editIdInput.value = id;
    nomeInput.value = participante;
    submitBtn.textContent = 'Salvar Alterações';
}

// Deletar aposta
async function deleteAposta(id) {
    if (confirm('Deseja realmente deletar esta aposta?')) {
        try {
            await fetch(`${'http://localhost:3000/api/apostas'}/${id}`, { method: 'DELETE' });
            fetchApostas();
        } catch (error) {
            console.error('Erro ao deletar aposta:', error);
        }
    }
}
