import React from 'react';
import { X, HelpCircle, ShieldCheck, Cpu, Zap, Database, MessageSquare, Image, Share2, Settings2, Terminal } from 'lucide-react';

interface ManualProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Manual: React.FC<ManualProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-900 rounded-xl text-white shadow-lg shadow-gray-200">
              <HelpCircle size={24} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 uppercase tracking-tighter text-2xl leading-tight">Centro de Operaciones</h3>
              <p className="text-[10px] text-red-600 font-bold uppercase tracking-[0.2em]">Manual de Usuario - Redactor AI</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-700 transition-all active:scale-90"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-12 custom-scrollbar bg-white">
          
          {/* Introducción */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-gray-900 border-b-2 border-red-700 pb-2 w-fit">
              <Zap size={20} className="text-red-700" />
              <h4 className="font-black uppercase text-sm tracking-[0.1em]">El Concepto Redactor</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Redactor no es solo un generador de posts; es un <strong>estudio de contenido multicanal</strong>. Utiliza inteligencia artificial de vanguardia para conectar la actualidad informativa con estrategias de marketing persuasivo, generando piezas visuales y escritas listas para publicar.
            </p>
          </section>

          {/* Gestión de Ideas y Noticias */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-2">
              <MessageSquare size={20} className="text-red-700" />
              <h4 className="font-black uppercase text-xs tracking-[0.2em]">1. Ideación y Actualidad</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-gray-900 flex items-center gap-2">
                  <Terminal size={14} className="text-red-700" /> Búsqueda en Tiempo Real
                </h5>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  El botón <strong>"Buscar Noticia"</strong> utiliza <em>Google Search Grounding</em> para localizar eventos de las últimas 24-48h. Esto garantiza que tu contenido siempre sea relevante y basado en hechos actuales.
                </p>
              </div>
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-gray-900 flex items-center gap-2">
                  <Settings2 size={14} className="text-red-700" /> Sugerencia de Temas
                </h5>
                <p className="text-[12px] text-gray-500 leading-relaxed">
                  Si tienes un concepto vago, <strong>"Sugerir Temas"</strong> analiza tu palabra clave y propone ángulos editoriales específicos para desbloquear la creatividad.
                </p>
              </div>
            </div>
          </section>

          {/* Personalidad e IA */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-2">
              <Cpu size={20} className="text-red-700" />
              <h4 className="font-black uppercase text-xs tracking-[0.2em]">2. Inteligencia y Personalidad</h4>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
              <p className="text-sm text-gray-700 font-medium italic">"No solo qué dices, sino quién lo dice."</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-700 text-white flex items-center justify-center text-[10px] font-bold">P</span>
                  <div className="text-[11px] text-gray-600"><strong>Personas Combinables:</strong> Puedes seleccionar varios roles (ej: Experto en Marketing + Narrador). La IA mezclará sus estilos para crear una voz única.</div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-700 text-white flex items-center justify-center text-[10px] font-bold">H</span>
                  <div className="text-[11px] text-gray-600"><strong>IA Humanizada:</strong> El modo <em>Humanized AI</em> suaviza los patrones repetitivos típicos de los LLM, buscando una lectura más orgánica.</div>
                </li>
              </ul>
            </div>
          </section>

          {/* Motor Visual */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-2">
              <Image size={20} className="text-red-700" />
              <h4 className="font-black uppercase text-xs tracking-[0.2em]">3. Motor Visual Avanzado</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors">
                <h5 className="font-bold text-[10px] uppercase text-red-700 mb-2 tracking-widest">Modelos</h5>
                <p className="text-[11px] text-gray-500 leading-tight"><strong>Gemini Pro Image</strong> para máxima calidad y detalle. <strong>Imagen 4.0</strong> para composiciones artísticas puras.</p>
              </div>
              <div className="p-4 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors">
                <h5 className="font-bold text-[10px] uppercase text-red-700 mb-2 tracking-widest">Estilos</h5>
                <p className="text-[11px] text-gray-500 leading-tight">Desde <strong>Fotorealismo</strong> hasta <strong>Pixel Art</strong> o <strong>Infografías</strong>. El estilo adapta la composición y el "mood" visual.</p>
              </div>
              <div className="p-4 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors">
                <h5 className="font-bold text-[10px] uppercase text-red-700 mb-2 tracking-widest">Refinado</h5>
                <p className="text-[11px] text-gray-500 leading-tight">Usa el icono del <strong>Lápiz</strong> sobre la imagen para pedirle a la IA cambios específicos (ej: "Añade un sol", "Hazlo azul").</p>
              </div>
            </div>
          </section>

          {/* Distribución y Formato */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-2">
              <Share2 size={20} className="text-red-700" />
              <h4 className="font-black uppercase text-xs tracking-[0.2em]">4. Formateo y Distribución</h4>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Redactor soluciona el problema de las redes sociales que no aceptan Markdown directamente:
              </p>
              <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-red-700"></div>
                    <p className="text-[12px] text-red-900"><strong>Estilo Unicode:</strong> El editor permite aplicar 𝗯𝗼𝗹𝗱 (negrita) y 𝘪𝘵𝘢𝘭𝘪𝘤 (cursiva) usando caracteres matemáticos de Unicode que se ven correctamente en LinkedIn y Twitter sin necesidad de Markdown.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-red-700"></div>
                    <p className="text-[12px] text-red-900"><strong>Adaptación de Imagen:</strong> Al regenerar para una plataforma específica, la IA ajusta el formato (1:1 o 16:9) y la intención visual (ej: profesional para LinkedIn, vibrante para Instagram).</p>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Configuración Técnica */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-2">
              <Settings2 size={20} className="text-red-700" />
              <h4 className="font-black uppercase text-xs tracking-[0.2em]">5. Parámetros Técnicos (Expertos)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900 p-4 rounded-2xl text-white">
                <p className="text-[10px] font-black uppercase text-red-500 mb-1">Temperature</p>
                <p className="text-[11px] opacity-70">Controla el azar. 0.1 = lógico/predecible. 0.9 = creativo/caótico.</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-2xl text-white">
                <p className="text-[10px] font-black uppercase text-red-500 mb-1">Top-P</p>
                <p className="text-[11px] opacity-70">Nucleus sampling. Filtra las palabras más probables según su peso acumulado.</p>
              </div>
              <div className="bg-gray-900 p-4 rounded-2xl text-white">
                <p className="text-[10px] font-black uppercase text-red-500 mb-1">Top-K</p>
                <p className="text-[11px] opacity-70">Limita el vocabulario de la IA a las K palabras más probables en cada paso.</p>
              </div>
            </div>
          </section>

          {/* Seguridad y Privacidad */}
          <section className="space-y-6 pb-4">
            <div className="flex items-center gap-3 text-gray-900 border-b border-gray-100 pb-2">
              <ShieldCheck size={20} className="text-red-700" />
              <h4 className="font-black uppercase text-xs tracking-[0.2em]">6. Blindaje y Privacidad</h4>
            </div>
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <Database size={24} className="text-gray-400" />
                  <div>
                    <h6 className="text-[11px] font-black uppercase text-gray-900">Privacidad Absoluta</h6>
                    <p className="text-[11px] text-gray-500 italic">No hay bases de datos. Todo vive en tu LocalStorage. Nadie más puede ver tus prompts.</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <Terminal size={24} className="text-gray-400" />
                  <div>
                    <h6 className="text-[11px] font-black uppercase text-gray-900">Acceso Inteligente</h6>
                    <p className="text-[11px] text-gray-500 italic">El PIN de seguridad y la Whitelist de IPs garantizan que solo tú accedas a tus créditos de API.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

        </div>

        {/* Footer Modal */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <button 
            onClick={onClose} 
            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
          >
            <span>Entendido, listo para crear</span>
            <Zap size={16} className="text-yellow-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Manual;