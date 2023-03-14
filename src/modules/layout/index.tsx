import React, { useState,  FC } from 'react';
import { Layout } from 'antd';
import { Link, NavLink } from 'react-router-dom';

import './index.css';

const { Content, Sider } = Layout;

interface IProps {
  children?: React.ReactElement | React.ReactNode;
}

const LayoutCom: FC<IProps> = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const routerMap = [
    {
      path: '/page1',
      name: '音频可视化',
    },
    {
      path: '/page2',
      name: '音量+左右声道',
    },
  ];

  const linkClassName = ({ isActive }: { isActive: boolean }) => {
    return `link ${isActive ? 'isActiveLink' : ''}`
  }

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        {routerMap.map((item) => {
          return (
            <NavLink key={item.path} to={item.path} className={linkClassName} >{item.name}</NavLink>
          )
        })}
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
