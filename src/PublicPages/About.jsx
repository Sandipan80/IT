import React from 'react';
import { Typography, Card, Col, Row, Statistic, Timeline } from 'antd';
import { motion } from 'framer-motion';
import { ShieldCheck, BarChart3, Users, Zap,Cpu, Database } from 'lucide-react';

const { Title, Paragraph, Text } = Typography;

const AboutPage = () => {
  // Animation Variants for Scroll Effects
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      
      {/* --- Hero Section with Depth Effect --- */}
      <section className="relative h-[60vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-600 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full blur-[150px]"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <Title level={1} className="text-white! mb-4! tracking-tight">
            Mastering Corporate Resources
          </Title>
          <Paragraph className="text-slate-300 text-lg max-w-2xl mx-auto">
            Our Asset Management System streamlines the lifecycle of IT and physical assets, 
            ensuring transparency, security, and peak operational efficiency.
          </Paragraph>
        </motion.div>
      </section>

      {/* --- Stats Section (Scroll Triggered) --- */}
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto -mt-16 px-6 relative z-20"
      >
        <Row gutter={[24, 24]}>
          {[
            { label: 'Assets Managed', val: '25k+', icon: <Database className="text-blue-500" /> },
            { label: 'Efficiency Gain', val: '40%', icon: <Zap className="text-yellow-500" /> },
            { label: 'Active Users', val: '1.2k', icon: <Users className="text-indigo-500" /> },
            { label: 'Data Security', val: '99.9%', icon: <ShieldCheck className="text-green-500" /> },
          ].map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <motion.div variants={fadeInUp}>
                <Card className="shadow-xl border-none hover:-translate-y-2.5 transition-transform duration-300">
                  <Statistic 
                    title={<span className="flex items-center gap-2">{stat.icon} {stat.label}</span>} 
                    value={stat.val} 
                    valueStyle={{ fontWeight: 700, color: '#1e293b' }} 
                  />
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>

      {/* --- Core Values (Hover Depth & Icons) --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <Title level={2}>Why Choose Our System?</Title>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <Row gutter={[40, 40]}>
          <Col xs={24} md={12}>
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeInUp}
              className="space-y-8"
            >
              <div className="flex gap-4">
                <div className="p-3 bg-blue-100 rounded-lg h-fit"><BarChart3 className="text-blue-600" /></div>
                <div>
                  <Title level={4}>Real-time Tracking</Title>
                  <Paragraph>Monitor every laptop, server, and software license from procurement to disposal. Get instant notifications on warranty expirations and maintenance schedules.</Paragraph>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg h-fit"><Cpu className="text-indigo-600" /></div>
                <div>
                  <Title level={4}>Automated Allocation</Title>
                  <Paragraph>Seamlessly assign assets to employees based on department and role, reducing manual paperwork and human error in IT helpdesk operations.</Paragraph>
                </div>
              </div>
            </motion.div>
          </Col>
          <Col xs={24} md={12}>
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeInUp}
            >
              <Card className="bg-slate-900 text-white rounded-2xl overflow-hidden relative border-none">
                <div className="p-4">
                  <Title level={3} className="text-white!">Our Evolution</Title>
                  <Timeline 
                    mode="left"
                    items={[
                      { children: <span className="text-slate-300">2023: System Concept & Architecture</span>, color: 'blue' },
                      { children: <span className="text-slate-300">2024: Beta Launch for IT Departments</span>, color: 'blue' },
                      { children: <span className="text-white font-semibold">2026: Enterprise-wide Integration</span>, color: 'green' },
                    ]}
                  />
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </section>

      {/* --- Footer CTA --- */}
      <section className="bg-white border-t py-16 text-center">
        <motion.div 
          whileInView={{ opacity: [0, 1], scale: [0.95, 1] }} 
          className="max-w-3xl mx-auto px-6"
        >
          <Title level={2}>Ready to optimize your inventory?</Title>
          <Paragraph className="text-slate-500 mb-8">
            Join hundreds of departments managing their assets with 100% accuracy and zero stress.
          </Paragraph>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg">
            Get Started Today
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;