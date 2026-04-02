import React from 'react';
import { 
  Typography, Card, Col, Row, Form, Input, Button, Space, message 
} from 'antd';
import { 
  MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GithubOutlined, 
  TwitterOutlined, 
  SendOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;

const ContactPage = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:5000/api/ContactRoute/ContactUs", values);
      console.log('Success:', response.data); 
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      // 2. Success Feedback

      message.success('Thank you! Your message has been sent successfully!');
      
      // 3. Reset the form fields to their initial values
      form.resetFields();

    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      message.error('failed: ' + (error.response?.data?.message || 'Server Error'));
    }
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };



  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 lg:px-20">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <Title level={1}>Contact Our Team</Title>
        <Paragraph className="text-gray-500 text-lg max-w-xl mx-auto">
          Need assistance with asset tracking or technical support? Drop us a message and our specialists will get back to you within 24 hours.
        </Paragraph>
      </motion.div>

      <Row gutter={[48, 48]} className="max-w-7xl mx-auto">
        
        {/* Left Side: Information Cards with Depth Effect */}
        <Col xs={24} lg={10}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Contact Method Cards */}
            <Card className="shadow-lg border-0 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-blue-600 text-2xl flex items-center justify-center">
                  <MailOutlined />
                </div>
                <div>
                  <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Email Support</Text>
                  <div className="text-lg font-semibold block">support@assetmanager.io</div>
                </div>
              </div>
            </Card>

            <Card className="shadow-lg border-0 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-4 rounded-xl text-indigo-600 text-2xl flex items-center justify-center">
                  <PhoneOutlined />
                </div>
                <div>
                  <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Call Directly</Text>
                  <div className="text-lg font-semibold block">+123456789</div>
                </div>
              </div>
            </Card>

            <Card className="shadow-lg border-0 rounded-2xl hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 p-4 rounded-xl text-emerald-600 text-2xl flex items-center justify-center">
                  <EnvironmentOutlined />
                </div>
                <div>
                  <Text type="secondary" className="text-xs uppercase font-bold tracking-wider">Global HQ</Text>
                  <div className="text-lg font-semibold block">452 Innovation Way, Austin, TX</div>
                </div>
              </div>
            </Card>

            {/* Social Media Links */}
            <div className="pt-8 text-center lg:text-left">
              <Title level={5} className="mb-4">Follow Our Updates</Title>
              <Space size="large">
                {[
                  { icon: <LinkedinOutlined />, color: 'hover:text-blue-700' },
                  { icon: <TwitterOutlined />, color: 'hover:text-sky-400' },
                  { icon: <GithubOutlined />, color: 'hover:text-gray-900' }
                ].map((item, idx) => (
                  <motion.a 
                    key={idx}
                    whileHover={{ scale: 1.2, rotate: 8 }}
                    className={`text-2xl text-gray-400 transition-colors duration-200 ${item.color}`}
                    href="#"
                  >
                    {item.icon}
                  </motion.a>
                ))}
              </Space>
            </div>
          </motion.div>
        </Col>

        {/* Right Side: Professional Contact Form */}
        <Col xs={24} lg={14}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-2xl border-0 rounded-3xl p-2 md:p-6 bg-white">
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                size="large"
                requiredMark={false}
              >
                <Row gutter={20}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="name"
                      label={<Text strong>Your Name</Text>}
                      rules={[{ required: true, message: 'Please let us know who you are' }]}
                    >
                      <Input placeholder="e.g. Alex Johnson" className="rounded-lg border-gray-200" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label={<Text strong>Work Email</Text>}
                      rules={[{ required: true, type: 'email', message: 'Enter a valid work email' }]}
                    >
                      <Input placeholder="alex@company.com" className="rounded-lg border-gray-200" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="subject"
                  label={<Text strong>Subject</Text>}
                >
                  <Input placeholder="How can we help your organization?" className="rounded-lg border-gray-200" />
                </Form.Item>

                <Form.Item
                  name="message"
                  label={<Text strong>Message</Text>}
                  rules={[{ required: true, message: 'Please type your inquiry' }]}
                >
                  <Input.TextArea rows={5} placeholder="Tell us more about your asset management needs..." className="rounded-lg border-gray-200" />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    icon={<SendOutlined />}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 border-none rounded-xl text-lg font-bold shadow-lg shadow-blue-200"
                  >
                    Send Inquiry
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default ContactPage;