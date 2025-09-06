import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Eye, 
  Search, 
  Scissors, 
  Baby, 
  FileText, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';

const ServiceCategory = ({ category, index }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-soft-light border border-slate-200 overflow-hidden hover:shadow-soft-medium transition-shadow duration-300"
    >
      {/* Category Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center">
              <category.icon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {category.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {category.description}
            </p>
            
            {/* Service Count Badge */}
            <div className="mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {category.services.length} serviços
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="p-6">
        <div className="space-y-3">
          {category.services.slice(0, isExpanded ? undefined : 3).map((service, serviceIndex) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: serviceIndex * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                  {service.name}
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  {service.shortDesc}
                </p>
              </div>
              <Link
                to={`/servico/${service.id}`}
                className="ml-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {service.actionText}
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        {category.services.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-4 p-3 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isExpanded ? 'Ver menos' : `Ver todos os ${category.services.length} serviços`}
            <ChevronDown 
              size={16} 
              className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </button>
        )}
      </div>
    </motion.div>
  );
};

const ServicesGrouped = () => {
  const { t } = useTranslation();

  // Grouped service categories with descriptive action text instead of "Saiba Mais"
  const serviceCategories = [
    {
      id: 'consultas-exames',
      title: 'Consultas e Exames Especializados',
      description: 'Avaliação completa da saúde ocular com tecnologia avançada e diagnóstico preciso.',
      icon: Eye,
      services: [
        {
          id: 'consultas-oftalmologicas',
          name: 'Consultas Oftalmológicas Completas',
          shortDesc: 'Exame abrangente com Dr. Philipe Saraiva',
          actionText: 'Agendar consulta'
        },
        {
          id: 'exames-de-refracao',
          name: 'Exames de Refração',
          shortDesc: 'Determinação precisa do grau para óculos',
          actionText: 'Verificar disponibilidade'
        },
        {
          id: 'campo-visual',
          name: 'Campo Visual Computadorizado',
          shortDesc: 'Detecção precoce de glaucoma e neuropatias',
          actionText: 'Entender o exame'
        },
        {
          id: 'mapeamento-de-retina',
          name: 'Mapeamento de Retina',
          shortDesc: 'Avaliação completa do fundo do olho',
          actionText: 'Ver indicações'
        }
      ]
    },
    {
      id: 'exames-diagnosticos',
      title: 'Exames Diagnósticos Avançados',
      description: 'Tecnologia de ponta para diagnóstico preciso de doenças oculares.',
      icon: Search,
      services: [
        {
          id: 'topografia-corneana',
          name: 'Topografia Corneana',
          shortDesc: 'Mapeamento da curvatura da córnea',
          actionText: 'Como é realizado'
        },
        {
          id: 'paquimetria',
          name: 'Paquimetria',
          shortDesc: 'Medição da espessura corneana',
          actionText: 'Ver importância'
        },
        {
          id: 'retinografia',
          name: 'Retinografia Digital',
          shortDesc: 'Fotografias de alta resolução da retina',
          actionText: 'Conhecer o processo'
        },
        {
          id: 'gonioscopia',
          name: 'Gonioscopia',
          shortDesc: 'Avaliação do ângulo da câmara anterior',
          actionText: 'Ver detalhes'
        }
      ]
    },
    {
      id: 'tratamentos-cirurgias',
      title: 'Tratamentos e Cirurgias',
      description: 'Procedimentos avançados para tratamento de diversas condições oculares.',
      icon: Scissors,
      services: [
        {
          id: 'cirurgias-oftalmologicas',
          name: 'Cirurgias Oftalmológicas',
          shortDesc: 'Catarata, pterígio e correção de grau',
          actionText: 'Ver procedimentos'
        },
        {
          id: 'tratamentos-especializados',
          name: 'Tratamentos Especializados',
          shortDesc: 'Glaucoma, degeneração macular e retina',
          actionText: 'Consultar opções'
        }
      ]
    },
    {
      id: 'oftalmologia-pediatrica',
      title: 'Oftalmologia Pediátrica',
      description: 'Cuidados especializados para a saúde ocular de bebês, crianças e adolescentes.',
      icon: Baby,
      services: [
        {
          id: 'acompanhamento-pediatrico',
          name: 'Consultas Pediátricas',
          shortDesc: 'Teste do olhinho e acompanhamento infantil',
          actionText: 'Agendar para criança'
        }
      ]
    },
    {
      id: 'laudos-documentos',
      title: 'Laudos e Documentos',
      description: 'Emissão de laudos técnicos para CNH, concursos e avaliações ocupacionais.',
      icon: FileText,
      services: [
        {
          id: 'laudos-especializados',
          name: 'Laudos Oftalmológicos',
          shortDesc: 'CNH, concursos públicos e ocupacionais',
          actionText: 'Solicitar laudo'
        }
      ]
    }
  ];

  return (
    <section id="services" className="py-16 lg:py-28 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700" data-testid="services-badge">
            {t('services.badge', 'Nossos Serviços')}
          </div>
          
          <motion.h2
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 drop-shadow-sm"
          >
            {t('services.title_full', 'Cuidados Oftalmológicos Completos')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed drop-shadow-sm"
          >
            {t('services.subtitle')}
          </motion.p>

          {/* Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center mt-8"
          >
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg" />
          </motion.div>
        </div>

        {/* Service Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {serviceCategories.map((category, index) => (
            <ServiceCategory
              key={category.id}
              category={category}
              index={index}
            />
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-slate-600 mb-6">
            Precisa de mais informações sobre nossos serviços?
          </p>
          <Link
            to="/servicos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Ver todos os serviços
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesGrouped;