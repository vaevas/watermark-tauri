import React, { useMemo, useState } from 'react';
import { ColorPicker, Form, Input, InputNumber, Slider, Space, Watermark,Button } from 'antd';
import type { Color } from 'antd/es/color-picker';
import domtoimage from 'dom-to-image';
import {downloadDir} from '@tauri-apps/api/path';
import { writeBinaryFile } from '@tauri-apps/api/fs';
import {  save } from "@tauri-apps/api/dialog"
interface WatermarkConfig {
  content: string;
  color: string | Color;
  fontSize: number;
  zIndex: number;
  rotate: number;
  gap: [number, number];
  offset?: [number, number];
}

const Mark: React.FC<any> = (props: any) => {
  const { url } = props
  const [form] = Form.useForm();
  const [config, setConfig] = useState<WatermarkConfig>({
    content: '测试示例',
    color: 'rgba(0, 0, 0, 0.15)',
    fontSize: 16,
    zIndex: 11,
    rotate: -22,
    gap: [100, 100],
    offset: undefined,
  });
  const { content, color, fontSize, zIndex, rotate, gap, offset } = config;

  const watermarkProps = useMemo(
    () => ({
      content,
      font: {
        color: typeof color === 'string' ? color : color.toRgbString(),
        fontSize,
      },
      zIndex,
      rotate,
      gap,
      offset,
    }),
    [config],
  );
  const downImg = async()=>{
    const basePath = await downloadDir() + new Date().getTime()+'.png'
    
  let selPath = await save({
    title: `保存文件`,
    defaultPath: basePath,
    filters: [{
      name: '*',
      extensions: ['png', 'jpeg']
    }]
  }) as string
  console.log(selPath);
  
    const blob = await domtoimage.toBlob(document.querySelector('.watermark-container'))
      const reader = new FileReader()
      reader.readAsArrayBuffer(blob)
      reader.onload = function (e: any) {
        const fcont = new Uint8Array(e.target.result)
        writeBinaryFile({contents: fcont, path: selPath})
      }
      
    }
  return (
    <>
    <div style={{display:'flex',marginTop :'20px',flexFlow:'wrap'}}>
      <Watermark {...watermarkProps} className="watermark-container">
     { url && <img
          style={{
            zIndex: 10,
            position: 'relative',
            width: '100%',
          }}
          src={url}
          alt="示例图片"
        />}
      </Watermark>
      <Form
        style={{
          width: 280,
          flexShrink: 0,
          borderLeft: '1px solid #eee',
          paddingLeft: 20,
          marginLeft: 20,
        }}
        form={form}
        layout="vertical"
        initialValues={config}
        onValuesChange={(_, values) => {
          setConfig(values);
        }}
      >
        <Form.Item name="content" label="水印文字">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item name="color" label="颜色">
          <ColorPicker />
        </Form.Item>
        <Form.Item name="fontSize" label="字体大小">
          <Slider step={1} min={1} max={100} />
        </Form.Item>
        <Form.Item name="zIndex" label="层级">
          <Slider step={1} min={0} max={100} />
        </Form.Item>
        <Form.Item name="rotate" label="角度">
          <Slider step={1} min={-180} max={180} />
        </Form.Item>
        <Form.Item label="分组大小" style={{ marginBottom: 0 }}>
          <Space style={{ display: 'flex' }} align="baseline">
            <Form.Item name={['gap', 0]}>
              <InputNumber placeholder="gapX" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['gap', 1]}>
              <InputNumber placeholder="gapY" style={{ width: '100%' }} />
            </Form.Item>
          </Space>
        </Form.Item>
        <Form.Item label="水印位置" style={{ marginBottom: 0 }}>
          <Space style={{ display: 'flex' }} align="baseline">
            <Form.Item name={['offset', 0]}>
              <InputNumber placeholder="offsetLeft" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['offset', 1]}>
              <InputNumber placeholder="offsetTop" style={{ width: '100%' }} />
            </Form.Item>
          </Space>
        </Form.Item>
      </Form>
    </div>
    <Button type="primary" onClick={downImg}>保存图片</Button>
    </>
  );
};

export default Mark;