"use client";

import { useState } from "react";
import { fetchAssetEvaluation, downloadEvaluationPdf, EvaluationPayload } from "@/lib/api";

export default function HomePage() {
  // 1. ESTADOS DEL SIMULADOR (Sincronizados estrictamente con tu API original)
  const [formData, setFormData] = useState<EvaluationPayload>({
    distrito: "Nervión",
    precio: 285000,
    ahorros: 60000,
    ingresos: 2600,
    metros: 65,
    euribor: 3.7,
    diferencial: 0.8, // Corregido: manteniendo tu variable exacta en castellano
    plazo_anos: 25,
    cuota_comunidad: 80,
    otras_deudas: 0
  });

  const [apiResult, setApiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. CONTROLADORES DE EVENTOS
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const numericFields = ["precio", "ahorros", "ingresos", "metros", "euribor", "diferencial", "plazo_anos", "cuota_comunidad", "otras_deudas"];
    
    setFormData(prev => ({
      ...prev,
      [id.replace("sim-", "")]: numericFields.includes(id.replace("sim-", "")) ? parseFloat(value) || 0 : value
    }));
  };

  const executeEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAssetEvaluation(formData);
      setApiResult(data);
      setTimeout(() => {
        document.getElementById("diagnostico-real")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError("No se ha podido conectar con el motor de cálculo. Verifica los datos introducidos.");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfDownload = async () => {
    setDownloadingPdf(true);
    try {
      await downloadEvaluationPdf(formData, formData.distrito);
    } catch (err) {
      alert("Hubo un problem al procesar y maquetar tu informe técnico en PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800">
      
      {/* BARRA DE NAVEGACIÓN EDITORIAL */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 lg:px-16 py-4 flex justify-between items-center">
        <div className="font-serif text-lg font-bold text-slate-900 tracking-tight">
          Dictum Previo <span className="font-sans text-[10px] font-bold tracking-wider text-orange-700 bg-orange-50 px-2 py-1 rounded ml-2">SEVILLA</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <a href="#metodologia" className="hover:text-slate-900 transition-colors">Metodología</a>
          <a href="#analisis" className="hover:text-slate-900 transition-colors">Estudio de Viabilidad</a>
          <a href="#contacto" className="hover:text-slate-900 transition-colors">Contacto</a>
        </div>
      </nav>

      {/* SECCIÓN DE BIENVENIDA */}
      <header className="px-6 pt-16 pb-20 max-w-4xl mx-auto text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-orange-700 mb-3">Análisis Patrimonial Independiente</div>
        <h1 className="hero-title text-4xl md:text-5xl mb-6">
          Una segunda opinión para tu <br />
          <span className="italic font-normal text-orange-800">compra más importante.</span>
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          Contrastamos el precio de oferta de la vivienda, calculamos el sobrecoste fiscal oculto del Impuesto de Transmisiones Patrimoniales (ITP) y simulamos tu solvencia económica tras la firma. Con datos oficiales y sin comisiones de intermediación.
        </p>

        {/* CONTENEDOR DEL FORMULARIO CON TU DISEÑO DE BAJA FRICCIÓN */}
        <div id="analisis" className="conversion-card p-6 md:p-8 text-left max-w-3xl mx-auto">
          <form onSubmit={executeEvaluation} className="space-y-6">
            
            {/* Campos de Entrada Principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2 tracking-wide">Distrito de Sevilla</label>
                <select id="sim-distrito" value={formData.distrito} onChange={handleInputChange} className="input-friendly font-medium bg-slate-50">
                  <option value="Casco Antiguo">Casco Antiguo</option>
                  <option value="Nervión">Nervión</option>
                  <option value="Triana">Triana</option>
                  <option value="Los Remedios">Los Remedios</option>
                  <option value="Sur">Sur</option>
                  <option value="San Pablo-Santa Justa">San Pablo-Santa Justa</option>
                  <option value="Bellavista-La Palmera">Bellavista-La Palmera</option>
                  <option value="Macarena">Macarena</option>
                  <option value="Este-Alcosa-Torreblanca">Este-Alcosa-Torreblanca</option>
                  <option value="Norte">Norte</option>
                  <option value="Cerro-Amate">Cerro-Amate</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2 tracking-wide">Precio de Oferta (€)</label>
                <input type="number" id="sim-precio" value={formData.precio} onChange={handleInputChange} className="input-friendly font-semibold" placeholder="Ej. 285000" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-2 tracking-wide">Aportación Propia (€)</label>
                <input type="number" id="sim-ahorros" value={formData.ahorros} onChange={handleInputChange} className="input-friendly font-semibold" placeholder="Ej. 60000" />
              </div>
            </div>

            {/* Campos Secundarios Modulados */}
            <div className="border-t border-slate-100 pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Ingresos Mensuales (€)</label>
                <input type="number" id="sim-ingresos" value={formData.ingresos} onChange={handleInputChange} className="input-friendly !py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Superficie útil (m²)</label>
                <input type="number" id="sim-metros" value={formData.metros} onChange={handleInputChange} className="input-friendly !py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Plazo Hipoteca (Años)</label>
                <input type="number" id="sim-plazo_anos" value={formData.plazo_anos} onChange={handleInputChange} className="input-friendly !py-2.5 text-sm" />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1.5">Gastos Comunidad (€)</label>
                <input type="number" id="sim-cuota_comunidad" value={formData.cuota_comunidad} onChange={handleInputChange} className="input-friendly !py-2.5 text-sm" />
              </div>
            </div>

            {/* Tu Botón Premium con Efecto Hover y Elevación */}
            <button type="submit" disabled={loading} className="btn-conversion w-full flex items-center justify-center font-semibold">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Consultando registros territoriales...
                </span>
              ) : "Analizar viabilidad de la compra →"}
            </button>
          </form>
          {error && <p className="mt-4 text-xs font-semibold text-red-600 text-center">{error}</p>}
        </div>
      </header>

      {/* SECCIÓN DINÁMICA DE RESULTADOS */}
      {apiResult && (
        <section id="diagnostico-real" className="bg-white border-t border-slate-200 py-16 px-6 transition-all">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">Conclusiones Preliminares del Análisis</h2>
            <p className="text-slate-500 text-xs mb-8">Cálculos efectuados conforme a la normativa fiscal de la Comunidad Autónoma de Andalucía y los valores de referencia del mercado de Sevilla.</p>

            {/* Banner Diagnóstico Adaptativo */}
            <div 
              className="p-5 border rounded-lg mb-8 flex items-start gap-4 text-sm"
              style={{ 
                backgroundColor: `${apiResult.metadata.color_identificador}10`, 
                borderColor: apiResult.metadata.color_identificador 
              }}
            >
              <span className="text-base" style={{ color: apiResult.metadata.color_identificador }}>⬤</span>
              <div>
                <h4 className="font-bold uppercase tracking-wide text-xs mb-1" style={{ color: apiResult.metadata.color_identificador }}>
                  {apiResult.metadata.veredicto_sistema}
                </h4>
                <p className="text-slate-700 leading-relaxed text-sm">
                  El esfuerzo financiero real estimado compromete el <span className="font-bold">{apiResult.kpis_base.ratio_esfuerzo_pct}%</span> de los ingresos netos del hogar. El índice de adecuación del precio para el entorno evaluado en el distrito de {apiResult.metadata.distrito_evaluado} se sitúa en <span className="font-bold">{apiResult.metadata.indice_realismo_zonal}</span>.
                </p>
              </div>
            </div>

            {/* Bloque del Informe Extendido */}
            <div className="p-8 bg-slate-900 text-white rounded-xl text-center space-y-5 shadow-lg max-w-2xl mx-auto">
              <span className="text-[10px] font-bold tracking-widest text-orange-400 uppercase">Estudio Técnico de Viabilidad Ampliado</span>
              <h3 className="font-serif text-xl md:text-2xl max-w-md mx-auto leading-snug">Dispón de una auditoría exhaustiva antes de comprometer tus ahorros</h3>
              <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
                Accede al dictamen completo de 6 páginas que desglosa la simulación bajo escenarios de tensión en los tipos de interés, el impacto patrimonial en euros del valor de referencia fiscal del suelo, la liquidez real remanente tras la firma y pautas metodológicas de negociación.
              </p>
              <div className="text-2xl font-serif font-bold text-orange-400">175 € <span className="text-[10px] font-sans text-slate-400 font-normal block mt-1">Honorarios cerrados · Impuestos incluidos · Generación y descarga inmediata</span></div>
              
              <div className="flex justify-center pt-2">
                <button onClick={handlePdfDownload} disabled={downloadingPdf} className="bg-orange-700 hover:bg-orange-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-xs shadow-sm">
                  {downloadingPdf ? "Generando documento..." : "Descargar Dictamen Técnico Completo (PDF)"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PROPUESTA DE INDEPENDENCIA */}
      <section id="metodologia" className="py-16 px-6 max-w-4xl mx-auto border-t border-slate-200">
        <h2 className="font-serif text-2xl font-bold text-slate-900 text-center mb-12">Por qué solicitar una segunda opinión patrimonial</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-slate-800">Ausencia de conflicto de interés</h3>
            <p className="text-slate-600 text-xs leading-relaxed">No percibimos comisiones de agencias ni intervenimos en la comercialización de los inmuebles. Nuestra única retribución proviene del estudio, salvaguardando una imparcialidad absoluta.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-slate-800">Prudencia analítica real</h3>
            <p className="text-slate-600 text-xs leading-relaxed">Sometemos la operación a los mismos modelos algorítmicos y escenarios de tensión financiera que aplican las entidades de crédito para la concesión de riesgos corporativos.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-slate-800">Contrastación de datos públicos</h3>
            <p className="text-slate-600 text-xs leading-relaxed">Los resultados prescinden de valoraciones subjetivas. El sistema extrae, cruza y pondera datos directamente de las sedes oficiales del Catastro, el INE y la Dirección General de Tributos.</p>
          </div>
        </div>
      </section>

      {/* PIE DE PÁGINA */}
      <footer id="contacto" className="bg-slate-950 text-slate-500 text-[11px] px-6 py-12 border-t border-slate-900">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center text-slate-400 font-medium text-xs">
            <div>© 2026 DICTUM PREVIO</div>
            <div className="space-x-4">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Condiciones</a>
            </div>
          </div>
          <p className="leading-relaxed border-t border-slate-900 pt-6 text-slate-600">
            AVISO LEGAL: Dictum Previo emite informes analíticos de carácter informativo y simulación estadística basados en datos procedentes de fuentes públicas oficiales y metodologías estándar de análisis financiero. Los resultados obtenidos constituyen estimaciones matemáticas e hipótesis y no representan asesoramiento jurídico formal, dictamen fiscal vinculante ni tasación oficial regulada por el Banco de España. La decisión de perfeccionar cualquier transacción inmobiliaria recae exclusivamente en el usuario.
          </p>
        </div>
      </footer>
    </div>
  );
}