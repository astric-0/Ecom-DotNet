import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from './Containers/Layout';
import './index.css';
import Init from './Containers/Init';

ReactDOM.createRoot(document.getElementById('root')).render(
  	<React.StrictMode>
		<Init>
      		<Layout />
		</Init>
  	</React.StrictMode>,
)