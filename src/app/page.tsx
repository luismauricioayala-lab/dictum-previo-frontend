"use client";

import { useState } from "react";
import { fetchAssetEvaluation, downloadEvaluationPdf, EvaluationPayload } from "@/lib/api";

export default function HomePage() {
  // 1. ESTADOS DEL SIMULADOR
  const [formData, setFormData] = useState<EvaluationPayload>({
    distrito: "Nervión",
    precio: 285000,
    ahorros: 60000,
    ingresos: 2600,
    metros: 65,
    euribor: 3.7,
    diferencial: 0.8,
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
      // Hacemos scroll suave automático hacia la zona de resultados
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
      alert("Hubo un problema al procesar y maquetar tu PDF premium.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#FAF9F5] text-slate-800">
      {/* BARRA DE NAVEGACIÓN EDITORIAL */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 lg:px-16 py-4 flex justify-between items-center">
        <div className="font-serif text-lg font-bold text-slate-900 tracking-tight">
          Dictum Previo <span className="font-sans text-xs font-semibold tracking-wider text-orange-700 bg-orange-50 px-2 py-1 rounded ml-2">SEVILLA</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <a href="#como-funciona" className="hover:text-slate-900 transition-colors">Metodología</a>
          <a href="#simulador" className="hover:text-slate-900 transition-colors">Simulador</a>
          <a href="#contacto" className="hover:text-slate-900 transition-colors">Contacto</a>
        </div>
      </nav>

      {/* HERO SECTION PRINCIPAL */}
      <header className="px-6 lg:px-16 pt-16 pb-24 max-w-5xl mx-auto text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-orange-700 mb-4">Análisis Patrimonial Independiente</div>
        <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl text-slate-900 mb-6 font-serif">
          Beyond the price tag.<br />
          <span className="italic font-normal text-orange-800">Know before you buy.</span>
        </h1>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          Contrastamos el precio de oferta de la vivienda, calculamos el sobrecoste fiscal oculto del ITP y simulamos tu supervivencia económica tras la firma. Con datos oficiales, sin comisiones de intermediación.
        </p>

        {/* CONTENEDOR DEL FORMULARIO DE ENTRADA (Baja fricción visual) */}
        <div id="simulador" className="conversion-card p-6 md:p-8 max-w-4xl mx-auto text-left">
          <form onSubmit={executeEvaluation} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-wide">Distrito de Sevilla</label>
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
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-wide">Precio de Compra (€)</label>
                <input type="number" id="sim-precio" value={formData.precio} onChange={handleInputChange} className="input-friendly font-semibold" placeholder="Ej. 285000" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-wide">Capital Aportado (€)</label>
                <input type="number" id="sim-ahorros" value={formData.ahorros} onChange={handleInputChange} className="input-friendly font-semibold" placeholder="Ej. 60000" />
              </div>
            </div>

            {/* EXPANDER SUTIL DE PARÁMETROS AVANZADOS */}
            <div className="border-t border-slate-100 pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Ingresos Netos/mes (€)</label>
                <input type="number" id="sim-ingresos" value={formData.ingresos} onChange={handleInputChange} className="input-friendly !py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Superficie (m²)</label>
                <input type="number" id="sim-metros" value={formData.metros} onChange={handleInputChange} className="input-friendly !py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Plazo Hipoteca (Años)</label>
                <input type="number" id="sim-plazo_anos" value={formData.plazo_anos} onChange={handleInputChange} className="input-friendly !py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Comunidad/mes (€)</label>
                <input type="number" id="sim-cuota_comunidad" value={formData.cuota_comunidad} onChange={handleInputChange} className="input-friendly !py-2 text-sm" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-conversion w-full flex items-center justify-center font-semibold">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Procesando variables catastrales...
                </span>
              ) : "Analizar viabilidad de la compra →"}
            </button>
          </form>
          {error && <p className="mt-4 text-xs font-semibold text-red-600 text-center">{error}</p>}
        </div>
      </header>

      {/* SECCIÓN DINÁMICA DE DIAGNÓSTICO EN VIVO */}
      {apiResult && (
        <section id="diagnostico-real" className="bg-white border-t border-slate-200 py-16 px-6 lg:px-16 transition-all">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-2">Resultados Preliminares del Activo</h2>
            <p className="text-slate-500 text-sm mb-8">Datos calculados cruzando la normativa del ITP de Andalucía y las tablas oficiales de Sevilla 2026.</p>

            {/* BANNER DE DIAGNÓSTICO CON COLOR ADAPTATIVO DINÁMICO */}
            <div 
              className="p-6 border rounded-xl mb-8 flex items-start gap-4"
              style={{ 
                backgroundColor: `${apiResult.metadata.color_identificador}10`, 
                borderColor: apiResult.metadata.color_identificador 
              }}
            >
              <span className="text-xl" style={{ color: apiResult.metadata.color_identificador }}>⬤</span>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wide mb-1" style={{ color: apiResult.metadata.color_identificador }}>
                  {apiResult.metadata.veredicto_sistema}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  El ratio de esfuerzo financiero real se sitúa en el <span className="font-bold">{apiResult.kpis_base.ratio_esfuerzo_pct}%</span> de los ingresos del hogar. El índice de realismo transaccional para la manzana en {apiResult.metadata.distrito_evaluado} es de <span className="font-bold">{apiResult.metadata.indice_realismo_zonal}</span>.
                </p>
              </div>
            </div>

            {/* MÓDULO ADICIONAL: CONVERSIÓN INFORME COMPLETO (PAYWALL INTEGRADO) */}
            <div className="p-8 bg-slate-900 text-white rounded-2xl text-center space-y-6 shadow-xl">
              <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">Estudio Técnico de Viabilidad Completo</span>
              <h3 className="font-serif text-2xl md:text-3xl max-w-xl mx-auto">Consigue el Plan de Vuelo v2.0 de tu propiedad</h3>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">
                Desbloquea el informe final de 6 páginas: matrices de estrés de tipos de interés, cuantificación exacta del sobrecoste del ITP inverso en euros, liquidez post-firma y una guía útil de negociación con el vendedor.
              </p>
              <div className="text-3xl font-serif font-bold text-orange-400">175 € <span className="text-xs font-sans text-slate-400 font-normal block mt-1">Precio cerrado · IVA incluido · Entrega inmediata automatizada</span></div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button onClick={handlePdfDownload} disabled={downloadingPdf} className="bg-orange-700 hover:bg-orange-800 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-md text-sm">
                  {downloadingPdf ? "Generando documento..." : "⬇️ Descargar Opinión Técnica Completa (PDF)"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PARTE DE PROPUESTA DE VALOR DEL SITIO ORIGINAL */}
      <section id="como-funciona" className="py-16 px-6 lg:px-16 max-w-5xl mx-auto border-t border-slate-200">
        <h2 className="font-serif text-3xl font-bold text-slate-900 text-center mb-12">Por qué auditar tu compra con nosotros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-slate-800">Sin conflicto de interés</h3>
            <p className="text-slate-600 text-sm leading-relaxed">No cobramos comisiones de agencias ni intermediamos en la compraventa. Nuestra única compensación es el coste del informe, lo que garantiza neutralidad absoluta.</p>
          </div>
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-slate-800">Prudencia bancaria real</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Sometemos tu operación a los mismos algoritmos de análisis y escenarios de estrés macroeconómico que aplican los departamentos de riesgos de la banca privada.</p>
          </div>
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-slate-800">Datos públicos cruzados</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Los cálculos no se basan en opiniones subjetivas. El sistema extrae, pondera y unifica métricas directas del Catastro, el INE y la Dirección General de Tributos.</p>
          </div>
        </div>
      </section>

      {/* PIE DE PÁGINA */}
      <footer className="bg-slate-950 text-slate-500 text-xs px-6 lg:px-16 py-12 border-t border-slate-900">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center text-slate-400 font-medium">
            <div>© 2026 DICTUM PREVIO</div>
            <div className="space-x-4">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
            </div>
          </div>
          <p className="leading-relaxed border-t border-slate-900 pt-6 text-[11px] text-slate-600">
            AVISO LEGAL: Dictum Previo emite informes analíticos de carácter informativo y simulación estadística basados en datos de fuentes públicas oficiales y metodologías estándar de análisis financiero. Los resultados arrojados constituyen estimaciones matemáticas hipotéticas y no implican asesoramiento jurídico formal, fiscal vinculante ni tasación oficial regulada por el Banco de España. La decisión de cierre de cualquier transacción inmobiliaria es responsabilidad exclusiva del usuario.
          </p>
        </div>
      </footer>
    </div>
  );
}