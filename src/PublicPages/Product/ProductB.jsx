import React from 'react';
// All Ant Design components imported here to prevent "is not defined" errors
import { 
  Typography, 
  Row, 
  Col, 
  Button, 
  Card, 
  Avatar, 
  Space, 
  Badge, 
  Rate, 
  Tag, 
  Statistic, 
  Divider, 
  ConfigProvider 
} from 'antd';

// Icons
import { 
  MobileOutlined, 
  AppleOutlined, 
  AndroidOutlined, 
  AntDesignOutlined,
  ThunderboltOutlined, 
  FireOutlined,
  CheckCircleFilled
} from '@ant-design/icons';

// Framer Motion for Animations
import { motion } from 'framer-motion';

const { Title, Paragraph, Text } = Typography;

// Animation Configs
const fadeInUp = {
  initial: { y: 60, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] } },
};

const bouncySpring = {
  type: "spring",
  stiffness: 100,
  damping: 10
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const MobileServices = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb', // Professional Blue
          borderRadius: 12,
        },
      }}
    >
      <motion.div 
        initial="initial" 
        animate="animate" 
        className="bg-white overflow-hidden min-h-screen"
      >
        {/* 1. HERO SECTION */}
        <section className="bg-blue-600 text-white pt-32 pb-24 px-6 relative flex items-center min-h-[85vh]">
          {/* Background Ambient Glow */}
          <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-white/10 to-transparent" />
          
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10 w-full">
            <div className="flex-1 text-left">
              <motion.div variants={fadeInUp}>
                <Badge 
                  count="Native UX • 2026 Engine" 
                  className="mb-6"
                  style={{ backgroundColor: '#fff', color: '#2563eb', fontWeight: 'bold', padding: '0 12px' }}
                />
              </motion.div>
              
              <motion.div variants={fadeInUp} transition={{ delay: 0.2 }}>
                <Title level={1} className="text-white! text-5xl! md:text-8xl! font-extrabold! mb-8! tracking-tighter leading-[0.9]!">
                  Fluid Motion, <br/>On-Device AI.
                </Title>
              </motion.div>

              <motion.div variants={fadeInUp} transition={{ delay: 0.4 }}>
                <Paragraph className="text-blue-100 text-xl max-w-xl mb-12 leading-relaxed">
                  We craft mobile experiences that don't just work—they feel alive. Leveraging Swift, Kotlin, and React Native to build the future of mobile commerce and utility.
                </Paragraph>
              </motion.div>
              
              <motion.div variants={fadeInUp} transition={{ delay: 0.6 }}>
                <Button size="large" className="h-16 px-12 text-lg font-bold rounded-2xl bg-white text-blue-600 border-none shadow-xl hover:scale-105 transition-all">
                  Consult a Specialist
                </Button>
              </motion.div>
            </div>
            
            <Col xs={24} md={10} className="flex justify-center relative">
              <motion.div 
                initial={{ x: 100, opacity: 0, rotate: 10 }} 
                animate={{ x: 0, opacity: 1, rotate: -5 }} 
                transition={{ delay: 0.5, ...bouncySpring }} 
                className="w-70 h-145 bg-slate-900 rounded-[50px] border-10 border-slate-800 shadow-2xl relative overflow-hidden flex items-center justify-center p-4"
              >
                 <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay: 1.2, ...bouncySpring}} className="text-center">
                   <FireOutlined className="text-blue-500 text-7xl mb-4 animate-bounce" />
                   <Text className="text-slate-400 block text-xs tracking-widest uppercase font-bold">Vault Mobile OS</Text>
                 </motion.div>
                 <div className="absolute top-0 w-1/3 h-6 bg-slate-800 rounded-b-3xl" />
              </motion.div>
              <div className="absolute -z-10 w-72 h-72 bg-blue-300/30 blur-[100px] rounded-full mt-24" />
            </Col>
          </div>
        </section>

        {/* 2. TECH STACK SECTION */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Title level={2} className="font-black! text-5xl! tracking-tighter">Engineered for Performance</Title>
          </div>
          <motion.div initial="initial" whileInView="animate" variants={staggerContainer} viewport={{ once: true }}>
            <Row gutter={[24, 24]}>
              {[
                { icon: <AppleOutlined />, title: "iOS Development", tags: ["SwiftUI", "CoreData", "Metal"] },
                { icon: <AndroidOutlined />, title: "Android Native", tags: ["Kotlin", "Compose", "Retrofit"] },
                { icon: <AntDesignOutlined />, title: "Hybrid Apps", tags: ["React Native", "Expo", "JSI"] },
                { icon: <ThunderboltOutlined />, title: "Connectivity", tags: ["gRPC", "MQTT", "Offline Sync"] }
              ].map((item, i) => (
                <Col xs={24} sm={12} lg={6} key={i}>
                  <motion.div variants={fadeInUp} whileHover={{ y: -10 }}>
                    <Card className="text-center h-full rounded-3xl border-slate-100 hover:shadow-2xl transition-shadow duration-300">
                      <div className="text-5xl text-blue-600 mb-4">{item.icon}</div>
                      <Title level={4} className="font-bold!">{item.title}</Title>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {item.tags.map(tag => <Tag key={tag} className="m-0 bg-slate-50 border-slate-200">{tag}</Tag>)}
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </section>

        {/* 3. PERFORMANCE STATS */}
        <section className="bg-slate-50 py-28 px-6 text-center border-y border-slate-100">
          <div className="max-w-4xl mx-auto">
            <Row gutter={[32, 32]}>
              {[
                { label: "App Store Rating", val: 4.9, suffix: "/ 5", color: "#3b82f6" },
                { label: "Cold Launch", val: 120, suffix: "ms", color: "#10b981" },
                { label: "Memory Usage", val: 45, suffix: "MB", color: "#a855f7" },
                { label: "API Speed", val: 90, suffix: "ms", color: "#f97316" }
              ].map((stat, i) => (
                <Col xs={12} md={6} key={i}>
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: i * 0.1, ...bouncySpring }} viewport={{ once: true }}>
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

        {/* 4. TESTIMONIAL */}
        <section className="py-24 px-6 text-center bg-white">
          <motion.div initial="initial" whileInView="animate" variants={fadeInUp} viewport={{ once: true }}>
            <div className="max-w-3xl mx-auto">
              <Avatar size={100} src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="mb-6 shadow-xl border-4 border-slate-50" />
              <Title level={3} className="font-serif! italic leading-relaxed text-3xl! text-slate-800">
                "The gesture controls and offline-first logic Vault implemented changed our entire delivery ecosystem. It's the most stable app we've ever launched."
              </Title>
              <Divider className="border-slate-100" />
              <Text strong className="text-blue-600 text-lg block uppercase tracking-widest">Rahul Kapoor</Text>
              <Text type="secondary">Product Lead, SwiftDelivery</Text>
              <div className="mt-12">
                 <Button type="primary" size="large" shape="round" className="h-16 px-12 bg-blue-600 border-none font-bold hover:scale-105 transition-all shadow-xl shadow-blue-200">
                   Start Your Mobile Journey
                 </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </ConfigProvider>
  );
};

export default MobileServices;