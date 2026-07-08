const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const novaFuncao = `  // ── Renderizar PDF ───────────────────────────────────────────
  function gerarPDF(d) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    const W = 210, H = 297;
    const PL = 14, PR = 14;
    const CW = W - PL - PR;

    // Paleta de cores
    const AZUL     = [0, 51, 153];
    const AZUL_BG  = [240, 244, 255];
    const CINZA    = [110, 110, 110];
    const CINZA_L  = [220, 220, 220];
    const PRETO    = [20, 20, 20];
    const BRANCO   = [255, 255, 255];
    const VERMELHO = [196, 30, 30];
    const HEADER_BG= [248, 249, 252];

    // ── Borda geral azul ──
    doc.setDrawColor(...AZUL);
    doc.setLineWidth(0.8);
    doc.rect(PL - 3, 8, CW + 6, 281);

    // ── Fundo do header ──
    doc.setFillColor(...HEADER_BG);
    doc.setDrawColor(...HEADER_BG);
    doc.rect(PL - 3, 8, CW + 6, 32, 'F');

    // ── Logo (proporção 250x104 = 2.404:1) ──
    const LOGO_W = 42, LOGO_H = 42 / 2.404;
    const LOGO_X = PL + 1;
    const LOGO_Y = 8 + (32 - LOGO_H) / 2;
    doc.addImage(LOGO_B64, 'PNG', LOGO_X, LOGO_Y, LOGO_W, LOGO_H);

    // ── Dados da empresa (centralizados na área direita) ──
    const EMP_START = PL + LOGO_W + 6;
    const EMP_CX    = EMP_START + (W - PR - EMP_START) / 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text('Nene Transportes Ltda.', EMP_CX, 19, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(110, 110, 110);
    doc.text('Rua Carlos Estevao, 333/105 - Jardim Leopoldina', EMP_CX, 24, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(110, 110, 110);
    doc.text('Porto Alegre - RS  |  CEP 91240-001', EMP_CX, 28.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(110, 110, 110);
    doc.text('(51) 99823.8670  |  nene_poa@hotmail.com', EMP_CX, 33, { align: 'center' });

    // ── Linha separadora ──
    doc.setDrawColor(0, 51, 153);
    doc.setLineWidth(0.6);
    doc.line(PL - 3, 40, W - PR + 3, 40);

    // ── CNPJ / Insc. Municipal ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(110, 110, 110);
    doc.text('CNPJ (MF) No 18.541.800/0001-85', PL, 45.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(110, 110, 110);
    doc.text('Insc. Municipal No 558.998.2.0', W - PR, 45.5, { align: 'right' });

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(PL - 3, 48, W - PR + 3, 48);

    // ── Faixa RECIBO ──
    doc.setFillColor(240, 244, 255);
    doc.setDrawColor(240, 244, 255);
    doc.rect(PL - 3, 48, CW + 6, 18, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(20, 20, 20);
    doc.text('RECIBO', W / 2 - 15, 61, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(110, 110, 110);
    doc.text('No', W / 2 + 16, 61);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(196, 30, 30);
    doc.text(String(d.numero), W / 2 + 26, 61);

    doc.setDrawColor(0, 51, 153);
    doc.setLineWidth(0.5);
    doc.line(PL - 3, 66, W - PR + 3, 66);

    // ── Campos ──
    function campo(label, valor, x, largura, y) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(0, 51, 153);
      doc.text(label, x, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      doc.text(valor || '', x, y + 5.5);

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.25);
      doc.line(x, y + 7, x + largura, y + 7);
    }

    let Y = 73;
    const GAP = 13;

    campo('NOME OU FIRMA', (d.nomeFirma || '').toUpperCase(), PL, CW, Y);
    Y += GAP;

    campo('ENDERECO', (d.endereco || '').toUpperCase(), PL, CW, Y);
    Y += GAP;

    const C1 = CW * 0.52, C2 = 24;
    const C3 = CW - C1 - C2 - 12;
    campo('MUNICIPIO',  (d.municipio || '').toUpperCase(), PL, C1 - 4, Y);
    campo('ESTADO',     (d.estado || '').toUpperCase(),    PL + C1, C2, Y);
    campo('INSC. MUN.', d.inscMun || '',                   PL + C1 + C2 + 6, C3, Y);
    Y += GAP;

    campo('CNPJ / CPF', d.cnpj || '',    PL, CW * 0.48, Y);
    campo('INSC. EST.', d.inscEst || '', PL + CW * 0.5 + 2, CW * 0.5 - 2, Y);
    Y += GAP;

    campo('NAT. DA OPERACAO', d.natOperacao || '', PL, CW * 0.62, Y);
    campo('DATA DA EMISSAO',  d.dataEmissao || '', PL + CW * 0.64 + 2, CW * 0.36 - 2, Y);
    Y += GAP + 4;

    // ── Tabela ──
    const linhas = d.itens.map(it => [
      it.quant % 1 === 0 ? String(Math.floor(it.quant)) : String(it.quant),
      it.desc || '',
      'R$ ' + it.unit.toFixed(2).replace('.', ','),
      'R$ ' + it.total.toFixed(2).replace('.', ','),
    ]);
    while (linhas.length < 9) linhas.push(['', '', '', '']);

    doc.autoTable({
      startY: Y,
      margin: { left: PL - 3, right: PR - 3 },
      head: [['Quant.', 'Discriminacao do Servico', 'Unitario', 'TOTAL R$']],
      body: linhas,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 51, 153],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'left',
        cellPadding: { top: 3.5, bottom: 3.5, left: 4, right: 4 },
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
        textColor: [20, 20, 20],
        cellPadding: { top: 2.5, bottom: 2.5, left: 4, right: 4 },
      },
      alternateRowStyles: { fillColor: [250, 251, 255] },
      tableLineColor: [220, 220, 220],
      tableLineWidth: 0.3,
    });

    const FIM_TAB = doc.lastAutoTable.finalY;

    doc.setDrawColor(0, 51, 153);
    doc.setLineWidth(0.5);
    doc.line(PL - 3, FIM_TAB, W - PR + 3, FIM_TAB);

    // ── Total ──
    const TY = FIM_TAB + 11;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text('TOTAL R$', W - PR - 70, TY);

    const BOX_X = W - PR - 52;
    const BOX_W = 50;
    const BOX_H = 12;
    doc.setFillColor(0, 51, 153);
    doc.setDrawColor(0, 51, 153);
    doc.roundedRect(BOX_X, TY - 8.5, BOX_W, BOX_H, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('R$ ' + d.total.toFixed(2).replace('.', ','),
             BOX_X + BOX_W / 2, TY, { align: 'center' });

    // ── Rodapé ──
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(PL - 3, 280, W - PR + 3, 280);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('Grafica Jocap - Fone: (51) 3470.4157', PL, 285);

    doc.setDrawColor(20, 20, 20);
    doc.setLineWidth(0.4);
    const AX = W / 2 - 28;
    doc.line(AX, 284, AX + 56, 284);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(20, 20, 20);
    doc.text('Ciente', AX + 28, 288.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(20, 20, 20);
    doc.text('NAO VALE COMO NOTA FISCAL', W - PR, 285, { align: 'right' });

    // ── Download ──
    const nome = 'Recibo_' + d.numero + '_' +
                 (d.nomeFirma || 'cliente').replace(/[^a-zA-Z0-9]/g, '_') + '.pdf';
    doc.save(nome);
  }`;

const inicio = html.indexOf('  // ── Renderizar PDF ───────────────────────────────────────────');
const fim    = html.indexOf('  // ── Helpers ─────────────────────────────────────────────────');

if (inicio === -1 || fim === -1) {
  console.error('Marcadores nao encontrados! inicio=' + inicio + ' fim=' + fim);
  process.exit(1);
}

html = html.substring(0, inicio) + novaFuncao + '\n\n' + html.substring(fim);
fs.writeFileSync('index.html', html);
console.log('Sucesso! Funcao substituida (' + novaFuncao.length + ' chars)');
