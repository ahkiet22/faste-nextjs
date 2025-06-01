import React from 'react'
import { useDropzone } from 'react-dropzone'

interface TProps {
  children: React.ReactNode
  upLoadFunc: (file: File) => void
  objectAcceptFile?: Record<string, string[]>
}

const WrapperFileUpload = (props: TProps) => {
  const { children, upLoadFunc, objectAcceptFile } = props

  const { getRootProps, getInputProps } = useDropzone({
    accept: objectAcceptFile ? objectAcceptFile : {},
    onDrop: acceptedFiles => {
      upLoadFunc(acceptedFiles[0])
      
      // console.log(acceptedFiles)
    }
  })

  return (
    <div {...getRootProps({ className: 'dropzone' })}>
      <input {...getInputProps()} />
      {children}
    </div>
  )
}

export default WrapperFileUpload
