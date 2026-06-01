const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tu-api-en-railway.com';

export interface EvaluationPayload {
  distrito: string;
  precio: number;
  ahorros: number;
  ingresos: number;
  metros: number;
  euribor?: number;
  diferencial?: number;
  plazo_anos?: number;
  cuota_comunidad?: number;
  otras_deudas?: number;
}

/**
 * Envía las variables del simulador y recibe el diagnóstico JSON detallado
 */
export async function fetchAssetEvaluation(payload: EvaluationPayload) {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v1/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Error en el procesamiento del motor analítico central');
  }

  return response.json();
}

/**
 * Solicita los bytes puros del PDF a la API y dispara la descarga nativa en el navegador
 */
export async function downloadEvaluationPdf(payload: EvaluationPayload, distrito: string) {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v1/evaluate/download-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Error crítico en el renderizador de PDFs del servidor');
  }

  // Convertimos la respuesta en un objeto binario (Blob) para forzar la descarga
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Dictum_Previo_Informe_${distrito.replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}