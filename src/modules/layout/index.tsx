import React, { useState,  FC } from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';

import './index.css';

const { Content, Sider } = Layout;

interface IProps {
  children?: React.ReactElement | React.ReactNode;
}

const LayoutCom: FC<IProps> = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          {props?.children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default LayoutCom;
