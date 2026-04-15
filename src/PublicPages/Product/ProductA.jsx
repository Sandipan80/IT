import React from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Button, 
  Card, 
  Avatar, 
  Badge, 
  Tag, 
  Statistic, 
  Divider, 
  ConfigProvider,
  Space
} from 'antd';
import { 
  GlobalOutlined, 
  CodeOutlined, 
  DatabaseOutlined, 
  ApiOutlined,
  CheckCircleFilled,
  DesktopOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Paragraph, Text } = Typography;

// Identical Animation Configs for that smooth "Front" feel
const fadeInUp = {
  initial: { y: 60, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const WebServices = () => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#0f172a', borderRadius: 16 } }}>
      <motion.div initial="initial" animate="animate" className="bg-white overflow-hidden min-h-screen">
        
        {/* 1. HERO SECTION - MATCHING THE MOBILE 'FRONT' STYLE */}
        <section className="bg-slate-950 text-white pt-32 pb-24 px-6 relative flex items-center min-h-[85vh]">
          {/* Background Glow */}
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white/5 to-transparent" />
          
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10 w-full">
            <div className="flex-1 text-left">
              <motion.div variants={fadeInUp}>
                <Badge 
                  count="Enterprise Web • MERN Architecture" 
                  style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px solid #1e3a8a', padding: '0 12px' }}
                  className="mb-8 shadow-lg"
                />
              </motion.div>
              
              <motion.div variants={fadeInUp} transition={{ delay: 0.2 }}>
                <Title level={1} className="!text-white !text-5xl md:!text-8xl !font-black !mb-8 tracking-tighter !leading-[0.9]">
                  Scalable Web, <br/><span className="text-blue-500">Built to Endure.</span>
                </Title>
              </motion.div>

              <motion.div variants={fadeInUp} transition={{ delay: 0.4 }}>
                <Paragraph className="text-slate-400 text-xl max-w-xl mb-12 leading-relaxed">
                  We engineer high-performance web platforms that serve as the backbone for modern businesses. From complex SaaS dashboards to high-traffic E-commerce engines.
                </Paragraph>
              </motion.div>
              
              <motion.div variants={fadeInUp} transition={{ delay: 0.6 }}>
                <Button size="large" className="h-16 px-12 text-lg font-bold rounded-2xl bg-white text-slate-900 border-none shadow-xl hover:scale-105 transition-all">
                  Consult a Specialist
                </Button>
              </motion.div>
            </div>
            
            {/* 2. VISUAL ELEMENT - Desktop/Browser Mockup */}
            <Col xs={24} md={12} className="flex justify-center relative">
              <motion.div 
                initial={{ y: 100, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.5, duration: 0.8 }} 
                className="w-full max-w-[550px] aspect-video bg-slate-900 rounded-3xl border-[8px] border-slate-800 shadow-2xl relative overflow-hidden flex items-center justify-center p-4"
              >
                 <div className="text-center">
                   <DesktopOutlined className="text-blue-500 text-7xl mb-4" />
                   <Text className="text-slate-500 block text-xs tracking-widest uppercase font-bold">Vault Web Engine v1.0</Text>
                 </div>
                 {/* Browser Dots */}
                 <div className="absolute top-4 left-6 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                 </div>
              </motion.div>
              <div className="absolute -z-10 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
            </Col>
          </div>
        </section>

        {/* 3. CAPABILITIES GRID */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Title level={2} className="!font-black !text-5xl tracking-tighter">Core Web Expertise</Title>
          </div>
          <motion.div initial="initial" whileInView="animate" variants={staggerContainer} viewport={{ once: true }}>
            <Row gutter={[32, 32]}>
              {[
                { icon: <ApiOutlined />, title: "SaaS Platforms", tags: ["RBAC", "Billing", "Real-time"] },
                { icon: <DatabaseOutlined />, title: "Cloud Systems", tags: ["AWS", "Docker", "Serverless"] },
                { icon: <CodeOutlined />, title: "Internal Tools", tags: ["MERN", "AntD", "Charts"] },
                { icon: <GlobalOutlined />, title: "Marketplaces", tags: ["SEO", "Payments", "Scalability"] }
              ].map((item, i) => (
                <Col xs={24} sm={12} lg={6} key={i}>
                  <motion.div variants={fadeInUp} whileHover={{ y: -12 }}>
                    <Card className="text-center h-full rounded-[32px] border-slate-100 hover:shadow-2xl transition-all duration-500 group">
                      <div className="text-5xl text-slate-800 mb-6 group-hover:text-blue-600 transition-colors">{item.icon}</div>
                      <Title level={4} className="!font-bold !text-2xl">{item.title}</Title>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {item.tags.map(t => <Tag key={t} className="m-0 bg-slate-50 border-slate-200">{t}</Tag>)}
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </section>

        {/* 4. WEB STATS SECTION */}
        <section className="bg-slate-900 py-28 px-6 text-center border-y border-slate-800">
          <div className="max-w-4xl mx-auto text-white">
            <Row gutter={[32, 32]}>
              {[
                { label: "Server Uptime", val: 99.9, suffix: "%", color: "#3b82f6" },
                { label: "Lighthouse Score", val: 98, suffix: "+", color: "#10b981" },
                { label: "Security Audit", val: "A+", isText: true, color: "#a855f7" },
                { label: "Response Time", val: 40, suffix: "ms", color: "#f97316" }
              ].map((stat, i) => (
                <Col xs={12} md={6} key={i}>
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                    <Statistic 
                      title={<Text className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">{stat.label}</Text>} 
                      value={stat.val} 
                      valueStyle={{ color: stat.color, fontWeight: 900, fontSize: '3rem' }} 
                      suffix={<span className="text-lg font-normal text-slate-400">{stat.suffix}</span>}
                    />
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* 5. TESTIMONIAL */}
        <section className="py-24 px-6 text-center bg-white">
          <motion.div initial="initial" whileInView="animate" variants={fadeInUp} viewport={{ once: true }}>
            <div className="max-w-3xl mx-auto">
              <Avatar size={100} src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sandipan" className="mb-6 shadow-xl border-4 border-slate-50" />
              <Title level={3} className="!font-serif italic leading-relaxed !text-3xl text-slate-800">
                "Vault reconstructed our entire web architecture in weeks. The MERN stack expertise is visible in the speed and stability of our platform today."
              </Title>
              <Divider className="border-slate-100" />
              <Text strong className="text-blue-600 text-lg block uppercase tracking-widest">Sandipan Singh</Text>
              <Text type="secondary">Lead Developer, IT Solutions</Text>
              <div className="mt-12">
                 <Button type="primary" size="large" shape="round" className="h-16 px-16 bg-blue-600 border-none font-bold hover:scale-105 shadow-xl shadow-blue-200">
                   Launch Your Project
                 </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </ConfigProvider>
  );
};

export default WebServices;