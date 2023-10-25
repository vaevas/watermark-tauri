import React from "react";
import { InboxOutlined } from '@ant-design/icons';
import { readBinaryFile } from '@tauri-apps/api/fs';
import { open } from "@tauri-apps/api/dialog"
import styles from "./upload.module.css";
const getFileUrl = (BinaryFile: any): string => {
  const blob = new Blob([BinaryFile], { type: 'image/png' });
  const url = URL.createObjectURL(blob);
  return url
}

const Upload: React.FC<any> = (props: any) => {
  const { getUrl } = props
  const handler = async () => {
    let filepath = await open({
      filters: [{
        name: 'Image',
        extensions: ['png', 'jpeg', 'jpg']
      }]
    }) as string
    const contents = await readBinaryFile(filepath);
    const url = getFileUrl(contents)
    getUrl(url)

  }
  window.addEventListener("drop", (e) => e.preventDefault(), false);
  window.addEventListener("dragover", (e) => e.preventDefault(), false);
  // window.addEventListener("contextmenu", (e) => e.preventDefault(), false);
  const dragenterEvent = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
  }
  const dragoverEvent = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
  }
  const dragleaveEvent = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
  }
  const dropEvent = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    const files = event.dataTransfer.files;
    const reader = new FileReader()
    reader.readAsArrayBuffer(files[0])
    reader.onload = function (e: any) {
      const fcont = new Uint8Array(e.target.result)
      const url = getFileUrl(fcont);
      getUrl(url)
    }
  }
  return (
    <div className={styles['upload-box']}
      onClick={handler}
      onDragEnter={dragenterEvent}
      onDragOver={dragoverEvent}
      onDragLeave={dragleaveEvent}
      onDrop={dropEvent}>
      <p className={styles['ant-upload-drag-icon']}>
        <InboxOutlined />
      </p>
      <p className={styles['ant-upload-text']}>单击或拖动文件到此区域进行上传</p>
      <p className={styles['ant-upload-hint']}>
        支持单个或批量上传
      </p>
    </div>
  )
}
export default Upload;