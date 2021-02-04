import React from 'react';
import { Link } from 'react-router-dom';

import { Breadcrumb } from 'antd';

const NavBreadcrumb = props => {
  const { elements } = props;

  return (
    <Breadcrumb style={{ margin: '1rem 0' }}>
      {
        elements.map(element =>
          <Breadcrumb.Item key={element.key}>
            {element.to ? <Link to={element.to}>{element.text}</Link>
              : <span>{element.text}</span>
            }
          </Breadcrumb.Item>
        )
      }
    </Breadcrumb>
  );
};

export default NavBreadcrumb;
