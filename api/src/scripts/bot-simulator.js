/**
 * Mock Bot Simulator
 */
// Un script simple que busca facturas 'PENDIENTE' y las pasa a 'PROCESADO' (SOLAMENTE ES FUNCIONAL EN CASO DE QUE NO TENGAS UN BOT DESARROLLADO EN AUTOMATION ANYWHERE)

const API_URL = "http://localhost:3001/api/invoice";

async function mockBot() {
  try {
    console.log("--- [MockBot] Buscando facturas pendientes... ---");
    const response = await fetch(`${API_URL}/`);
    const invoices = await response.json();
    const pendientes = invoices.filter(i => i.invoice_status === 'PENDIENTE');

    if (pendientes.length === 0) {
      console.log("[MockBot] No hay facturas pendientes.");
      return;
    }

    for (const inv of pendientes) {
      console.log(`[MockBot] Procesando factura: ${inv.invoice_file_name} (ID: ${inv.invoice_id})`);
      
      // Simulamos un delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updateResponse = await fetch(`${API_URL}/status/${inv.invoice_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PROCESADO' })
      });

      if (updateResponse.ok) {
        console.log(`[MockBot] Factura ${inv.invoice_file_name} marcada como PROCESADO.`);
      } else {
        console.error(`[MockBot] Error al actualizar factura ${inv.invoice_id}`);
      }
    }
  } catch (error) {
    console.error("[MockBot] Error conectando con la API:", error.message);
  }
}

console.log("[MockBot] Iniciado. Monitoreando cada 10 segundos...");
mockBot();
setInterval(mockBot, 10000);