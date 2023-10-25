import React, { useState } from 'react';
import Upload from './Upload';
import Mark from './Mark';
const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const getChildUrl = (val: string) => {
    setUrl(val);
  }
  return (
    <>
      <Upload getUrl={getChildUrl} />
      <Mark url={url} />
    </>
  )
};

export default App;
