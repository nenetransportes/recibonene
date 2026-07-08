const fs = require('fs');
const LOGO = fs.readFileSync('logo_b64.txt', 'utf8').trim();

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Recibos – Nene Transportes</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"><\/script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f2f5;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:40px 16px}
.card{background:#fff;border-radius:20px;box-shadow:0 4px 32px rgba(0,0,0,.08);width:100%;max-width:740px;padding:40px 48px 52px}
.top{display:flex;align-items:center;gap:24px;margin-bottom:16px}
.top img{height:64px;object-fit:contain}
.top-info{flex:1;text-align:right}
.top-info .nome{font-size:15px;font-weight:700;color:#111;margin-bottom:4px}
.top-info p{font-size:12px;color:#999;line-height:1.8}
hr.div{border:none;border-top:1px solid #f0f0f0;margin:0 0 16px}
.recibo-num{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;padding:10px 0;border-bottom:1px solid #f0f0f0}
.recibo-num .label{font-size:11px;font-weight:700;letter-spacing:3px;color:#bbb;text-transform:uppercase}
.recibo-num .num{font-size:26px;font-weight:800;color:#111;letter-spacing:-1px}
.recibo-num .num span{color:#bbb;font-size:14px;font-weight:400;margin-right:4px}
.field{display:flex;flex-direction:column;gap:5px;margin-bottom:18px}
.field label{font-size:10px;font-weight:700;color:#bbb;text-transform:uppercase;letter-spacing:.7px}
.field input{border:none;border-bottom:1.5px solid #ebebeb;border-radius:0;padding:8px 2px;font-size:13.5px;color:#222;outline:none;transition:border .2s;background:transparent}
.field input:focus{border-bottom-color:#111}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.grid3{display:grid;grid-template-columns:2.2fr .7fr 1.4fr;gap:20px}
.sec-title{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#ccc;margin:8px 0 16px}
table.it{width:100%;border-collapse:collapse;font-size:13px}
table.it thead th{background:#111;color:#fff;padding:11px 12px;font-size:10px;font-weight:700;letter-spacing:.5px;text-align:left}
table.it thead th:first-child{border-radius:8px 0 0 8px}
table.it thead th:last-child{border-radius:0 8px 8px 0;padding-right:12px}
table.it thead th:nth-child(3),table.it thead th:nth-child(4){text-align:right}
table.it tbody tr:nth-child(even) td{background:#fafafa}
table.it tbody td{border-bottom:1px solid #f3f3f3;padding:7px 12px;vertical-align:middle}
table.it tbody td:nth-child(3),table.it tbody td:nth-child(4){text-align:right}
table.it input{border:none;background:transparent;font-size:13px;width:100%;outline:none;color:#222}
table.it input:focus{border-bottom:1.5px solid #111}
.cq{width:72px}.cu{width:115px}.ct{width:115px}
.bdel{background:none;border:none;cursor:pointer;color:#ddd;font-size:20px;line-height:1;padding:0 4px;transition:color .15s}
.bdel:hover{color:#e74c3c}
.badd{margin-top:12px;background:none;border:1.5px dashed #ddd;color:#bbb;font-size:12px;font-weight:600;padding:8px 20px;border-radius:8px;cursor:pointer;transition:all .2s}
.badd:hover{border-color:#111;color:#111}
.total-row{display:flex;justify-content:flex-end;align-items:center;gap:16px;margin-top:24px}
.total-row .tlabel{font-size:13px;font-weight:700;color:#333;letter-spacing:.5px}
.total-val{background:#111;color:#fff;border-radius:10px;padding:11px 24px;font-size:17px;font-weight:700;min-width:160px;text-align:center;letter-spacing:.5px}
.btn-pdf{display:block;width:100%;margin-top:40px;background:#111;color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:.5px;padding:16px;cursor:pointer;transition:background .2s}
.btn-pdf:hover{background:#333}
.btn-pdf:disabled{background:#ccc;cursor:not-allowed}
#st{margin-top:14px;text-align:center;font-size:13px;color:#27ae60;min-height:20px}
#st.e{color:#e74c3c}
footer{margin-top:32px;font-size:11px;color:#ccc;text-align:center}
</style>
</head>
<body>
<div class="card">
  <div class="top">
    <img src="${LOGO}" alt="Nene Transportes"/>
    <div class="top-info">
      <div class="nome">Nenê Transportes Ltda.</div>
      <p>Rua Carlos Estevão, 333/105 – Jardim Leopoldina<br>
         Porto Alegre – RS – CEP 91240-001<br>
         (51) 99823.8670 &nbsp;|&nbsp; nene_poa@hotmail.com</p>
    </div>
  </div>
  <hr class="div"/>

  <div class="recibo-num">
    <div class="label">Recibo</div>
    <div class="num"><span>Nº</span><span id="exibeNumero">...</span></div>
  </div>


  <div class="field"><label>Nome ou Firma</label><input id="nomeFirma" placeholder="Nome completo ou razão social"/></div>
  <div class="field"><label>Endereço</label><input id="endereco" placeholder="Rua, número, complemento"/></div>
  <div class="grid3">
    <div class="field"><label>Cidade</label><input id="municipio" placeholder="Cidade"/></div>
    <div class="field"><label>UF</label><input id="estado" placeholder="UF" maxlength="2" style="text-transform:uppercase"/></div>
    <div class="field"><label>Inscrição Municipal</label><input id="inscMun" placeholder="Insc. Municipal"/></div>
  </div>
  <div class="grid2">
    <div class="field"><label>CNPJ / CPF</label><input id="cnpj" placeholder="00.000.000/0000-00"/></div>
    <div class="field"><label>Insc. Estadual</label><input id="inscEst" placeholder="Inscrição Estadual"/></div>
  </div>
  <div class="grid2">
    <div class="field"><label>Nat. da Operação</label><input id="natOp" placeholder="Natureza da operação"/></div>
    <div class="field"><label>Data da Emissão</label><input id="dataEm" type="date"/></div>
  </div>

  <div class="sec-title">Discriminação dos Serviços</div>
  <table class="it">
    <thead><tr>
      <th class="cq">Quant.</th>
      <th>Discriminação do Serviço</th>
      <th class="cu">Unitário (R$)</th>
      <th class="ct">Total R$</th>
      <th style="width:36px"></th>
    </tr></thead>
    <tbody id="corpo"></tbody>
  </table>
  <button class="badd" id="bAdd">+ Adicionar item</button>
  <div class="total-row">
    <span class="tlabel">TOTAL R$</span>
    <div class="total-val" id="exTotal">R$ 0,00</div>
  </div>
  <button class="btn-pdf" id="bGerar">Gerar Recibo em PDF</button>
  <div id="st"></div>
</div>
<footer>Nene Transportes Cinematográfico — Sistema de Recibos</footer>

<script>
// ── Logo embutida ─────────────────────────────────────────────
const LOGO_B64 = "${LOGO}";

// ── Estado ───────────────────────────────────────────────────
let proximoNumero = 752;
let itemCount = 0;

// ── Init ─────────────────────────────────────────────────────
async function init() {
  document.getElementById('dataEm').valueAsDate = new Date();
  // keep-alive: INSERT no banco para evitar pausa automática do Supabase
  fetch('/.netlify/functions/keepalive').catch(() => {});
  await carregarNumero();
  addItem();
}

async function carregarNumero() {
  try {
    const r = await fetch('/.netlify/functions/proximo-numero');
    const j = await r.json();
    if (j.numero) proximoNumero = j.numero;
  } catch(e) { console.warn('fallback local'); }
  document.getElementById('exibeNumero').textContent = proximoNumero;
}

// ── Itens ─────────────────────────────────────────────────────
function addItem() {
  itemCount++;
  const id = itemCount;
  const tr = document.createElement('tr');
  tr.dataset.id = id;
  tr.innerHTML =
    "<td class='cq'><input type='number' min='0' step='0.01' value='1' class='iq' data-r='" + id + "' oninput='rc(" + id + ")'/></td>" +
    "<td><input type='text' class='id' data-r='" + id + "' placeholder='Descrição'/></td>" +
    "<td class='cu'><input type='number' min='0' step='0.01' value='0' class='iu' data-r='" + id + "' oninput='rc(" + id + ")'/></td>" +
    "<td class='ct'><span class='it' data-r='" + id + "'>R$ 0,00</span></td>" +
    "<td><button class='bdel' onclick='del(" + id + ")'>×</button></td>";
  document.getElementById('corpo').appendChild(tr);
}

function del(id) {
  const tr = document.querySelector('tr[data-id="' + id + '"]');
  if (tr) tr.remove();
  totGeral();
}

function rc(id) {
  const q = parseFloat(document.querySelector('.iq[data-r="' + id + '"]').value) || 0;
  const u = parseFloat(document.querySelector('.iu[data-r="' + id + '"]').value) || 0;
  const s = document.querySelector('.it[data-r="' + id + '"]');
  if (s) s.textContent = 'R$ ' + (q * u).toFixed(2).replace('.', ',');
  totGeral();
}

function totGeral() {
  let t = 0;
  document.querySelectorAll('.it').forEach(s => {
    t += parseFloat(s.textContent.replace('R$ ', '').replace(',', '.')) || 0;
  });
  document.getElementById('exTotal').textContent = 'R$ ' + t.toFixed(2).replace('.', ',');
  return t;
}

function getItens() {
  return Array.from(document.querySelectorAll('#corpo tr')).map(tr => {
    const id = tr.dataset.id;
    return {
      quant: parseFloat(document.querySelector('.iq[data-r="' + id + '"]').value) || 0,
      desc:  document.querySelector('.id[data-r="' + id + '"]').value || '',
      unit:  parseFloat(document.querySelector('.iu[data-r="' + id + '"]').value) || 0,
      total: parseFloat((document.querySelector('.it[data-r="' + id + '"]').textContent || '0').replace('R$ ', '').replace(',', '.')) || 0,
    };
  });
}

function fmtData(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return d + '/' + m + '/' + y;
}

document.getElementById('bAdd').addEventListener('click', addItem);

// ── Gerar ─────────────────────────────────────────────────────
document.getElementById('bGerar').addEventListener('click', async () => {
  const btn = document.getElementById('bGerar');
  const st  = document.getElementById('st');
  btn.disabled = true;
  st.className = '';
  st.textContent = 'Gerando...';

  const dados = {
    numero:      proximoNumero,
    nomeFirma:   document.getElementById('nomeFirma').value.trim(),
    endereco:    document.getElementById('endereco').value.trim(),
    municipio:   document.getElementById('municipio').value.trim(),
    estado:      document.getElementById('estado').value.trim().toUpperCase(),
    inscMun:     document.getElementById('inscMun').value.trim(),
    cnpj:        document.getElementById('cnpj').value.trim(),
    inscEst:     document.getElementById('inscEst').value.trim(),
    natOperacao: document.getElementById('natOp').value.trim(),
    dataEmissao: fmtData(document.getElementById('dataEm').value),
    itens:       getItens(),
    total:       totGeral(),
  };

  if (!dados.nomeFirma) {
    st.className = 'e';
    st.textContent = 'Preencha o Nome ou Firma.';
    btn.disabled = false;
    return;
  }

  try {
    gerarPDF(dados);
    await fetch('/.netlify/functions/salvar-recibo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    proximoNumero++;
    document.getElementById('exibeNumero').textContent = proximoNumero;
    st.textContent = 'Recibo No ' + dados.numero + ' gerado com sucesso!';
  } catch(e) {
    st.className = 'e';
    st.textContent = 'PDF gerado (erro ao salvar: ' + e.message + ')';
  }
  btn.disabled = false;
});

// ── PDF MODERNO ────────────────────────────────────────────────
function gerarPDF(d) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const PW = 210;
  const ML = 16, MR = 16, CW = PW - ML - MR;

  // Borda externa arredondada
  doc.setDrawColor(210, 210, 210);
  doc.setLineWidth(0.4);
  doc.roundedRect(ML - 4, 8, CW + 8, 281, 3, 3);

  // Fundo cinza no header
  doc.setFillColor(248, 248, 248);
  doc.setDrawColor(248, 248, 248);
  doc.roundedRect(ML - 4, 8, CW + 8, 34, 3, 3, 'F');
  doc.rect(ML - 4, 28, CW + 8, 14, 'F');

  // Logo
  const LW = 40, LH = 40 / 2.404;
  doc.addImage(LOGO_B64, 'PNG', ML, 8 + (34 - LH) / 2, LW, LH);

  // Dados empresa
  const EX = ML + LW + 6;
  const ECX = EX + (PW - MR - EX) / 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text('Nene Transportes Ltda.', ECX, 19, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Rua Carlos Estevao, 333/105 - Jardim Leopoldina', ECX, 24, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Porto Alegre - RS  |  CEP 91240-001', ECX, 28.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('(51) 99823.8670  |  nene_poa@hotmail.com', ECX, 33, { align: 'center' });

  // Linha divisória
  doc.setDrawColor(225, 225, 225);
  doc.setLineWidth(0.3);
  doc.line(ML - 4, 42, PW - MR + 4, 42);

  // CNPJ
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text('CNPJ (MF) No 18.541.800/0001-85', ML, 47);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text('Insc. Municipal No 558.998.2.0', PW - MR, 47, { align: 'right' });

  doc.setDrawColor(225, 225, 225);
  doc.setLineWidth(0.3);
  doc.line(ML - 4, 50, PW - MR + 4, 50);

  // RECIBO (esquerda) + Nº número (direita)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 30);
  doc.text('RECIBO', ML, 61);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  doc.text('Nº', PW - MR - 28, 61, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 30);
  doc.text(String(d.numero), PW - MR, 61, { align: 'right' });

  doc.setDrawColor(225, 225, 225);
  doc.setLineWidth(0.3);
  doc.line(ML - 4, 66, PW - MR + 4, 66);

  // Campos
  function campo(label, val, x, w, y) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(180, 180, 180);
    doc.text(label, x, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(val || '', x, y + 5.5);
    doc.setDrawColor(235, 235, 235);
    doc.setLineWidth(0.25);
    doc.line(x, y + 7, x + w, y + 7);
  }

  let Y = 71;
  const G = 11;

  campo('NOME OU FIRMA', (d.nomeFirma || '').toUpperCase(), ML, CW, Y); Y += G;
  campo('ENDERECO', (d.endereco || '').toUpperCase(), ML, CW, Y); Y += G;

  const w1 = CW * 0.52, w2 = 22;
  campo('MUNICIPIO', (d.municipio || '').toUpperCase(), ML, w1 - 4, Y);
  campo('ESTADO', (d.estado || '').toUpperCase(), ML + w1, w2, Y);
  campo('INSC. MUN.', d.inscMun || '', ML + w1 + w2 + 6, CW - w1 - w2 - 10, Y); Y += G;

  campo('CNPJ / CPF', d.cnpj || '', ML, CW * 0.48, Y);
  campo('INSC. EST.', d.inscEst || '', ML + CW * 0.5 + 2, CW * 0.5 - 2, Y); Y += G;

  campo('NAT. DA OPERACAO', d.natOperacao || '', ML, CW * 0.62, Y);
  campo('DATA DA EMISSAO', d.dataEmissao || '', ML + CW * 0.64 + 2, CW * 0.36 - 2, Y); Y += G + 5;

  // Tabela
  const rows = d.itens.map(it => [
    Number.isInteger(it.quant) ? String(it.quant) : it.quant.toFixed(2),
    it.desc || '',
    'R$ ' + it.unit.toFixed(2).replace('.', ','),
    'R$ ' + it.total.toFixed(2).replace('.', ','),
  ]);
  while (rows.length < 9) rows.push(['', '', '', '']);

  doc.autoTable({
    startY: Y,
    margin: { left: ML - 4, right: MR - 4 },
    head: [['Quant.', 'Discriminacao do Servico', 'Unitario', 'TOTAL R$']],
    body: rows,
    theme: 'plain',
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
      cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
    },
    columnStyles: {
      0: { cellWidth: 22, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 36, halign: 'right' },
      3: { cellWidth: 36, halign: 'right', fontStyle: 'bold' },
    },
    bodyStyles: {
      fontSize: 9,
      minCellHeight: 9,
      textColor: [30, 30, 30],
      cellPadding: { top: 2.5, bottom: 2.5, left: 5, right: 5 },
      lineColor: [235, 235, 235],
      lineWidth: 0.25,
    },
    alternateRowStyles: { fillColor: [250, 250, 250] },
  });

  const FY = doc.lastAutoTable.finalY;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(ML - 4, FY, PW - MR + 4, FY);

  // Total — label à esquerda, caixa à direita sem sobreposição
  const TY = FY + 11;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text('TOTAL R$', ML, TY);

  const BX = PW - MR - 52, BW = 50, BH = 12;
  doc.setFillColor(30, 30, 30);
  doc.setDrawColor(30, 30, 30);
  doc.roundedRect(BX, TY - 8.5, BW, BH, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('R$ ' + d.total.toFixed(2).replace('.', ','), BX + BW / 2, TY, { align: 'center' });

  // Rodapé
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.line(ML - 4, 280, PW - MR + 4, 280);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(190, 190, 190);
  doc.text('Grafica Jocap - Fone: (51) 3470.4157', ML, 285);

  const AX = PW / 2 - 28;
  doc.setDrawColor(160, 160, 160);
  doc.setLineWidth(0.4);
  doc.line(AX, 284, AX + 56, 284);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Ciente', AX + 28, 288.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('NAO VALE COMO NOTA FISCAL', PW - MR, 285, { align: 'right' });

  doc.save('Recibo_' + d.numero + '_' + (d.nomeFirma || 'cliente').replace(/[^a-zA-Z0-9]/g, '_') + '.pdf');
}

init();
</script>
</body>
</html>`;

fs.writeFileSync('index.html', html);
console.log('index.html gerado com sucesso:', html.length, 'chars');
